import { type CardPosition } from "@/types/cards";
import { CARD_RANKS, CardRank, HAND_VALUES, HandType } from "@/utils/constants";
import { type PokerHand } from "@/types/hands";

export class Calculator {
  static calculateScore(cards: CardPosition[]): {
    score: number;
    scoredCards: (CardPosition & { chips: number[]; mults: number[] })[];
    pokerHand: PokerHand;
  } {
    const pokerHand = this.identifyPokerHand(cards);
    const { baseChips, scoredCards } = this.calculateBaseChips(
      pokerHand.scoredCards
    );

    return {
      score: (baseChips + pokerHand.chips) * pokerHand.mult,
      scoredCards,
      pokerHand: pokerHand,
    };
  }

  private static calculateBaseChips(cards: CardPosition[]): {
    baseChips: number;
    scoredCards: (CardPosition & { chips: number[]; mults: number[] })[];
  } {
    const scoredCards: (CardPosition & { chips: number[]; mults: number[] })[] =
      [];
    const baseChips = cards.reduce((sum, card) => {
      let value = 0;
      // Face cards (J, Q, K) are worth 10, Ace is worth 11
      if (CARD_RANKS[card.rank] === CARD_RANKS[CardRank.ACE]) {
        value = 11;
        scoredCards.push({ ...card, chips: [11], mults: [] });
      } else if (CARD_RANKS[card.rank] > 10) {
        value = 10;
        scoredCards.push({ ...card, chips: [10], mults: [] });
      } else {
        value = CARD_RANKS[card.rank];
        if (value > 0) {
          scoredCards.push({ ...card, chips: [value], mults: [] });
        }
      }
      return sum + value;
    }, 0);

    return { baseChips, scoredCards };
  }

  private static identifyPokerHand(
    cards: CardPosition[]
  ): PokerHand & { scoredCards: CardPosition[] } {
    // Pre-calculate common checks that are used by multiple hand types
    const rankCounts = this.getRankCounts(cards);
    const { isValid: isAllSameSuit } = this.isFlush(cards);
    const { isValid: isStraightHand } = this.isStraight(cards);

    // Organize checks from most specific/valuable to least, with optimized short-circuits
    if (isAllSameSuit) {
      // Check flush-based hands first if we know it's a flush
      if (cards.every((card) => card.rank === cards[0].rank)) {
        return this.createHandResult(HandType.FlushFive, cards, cards);
      }

      const counts = Object.values(rankCounts);
      if (counts.includes(3) && counts.includes(2)) {
        return this.createHandResult(HandType.FlushHouse, cards, cards);
      }

      if (isStraightHand) {
        return this.createHandResult(HandType.StraightFlush, cards, cards);
      }

      return this.createHandResult(HandType.Flush, cards, cards);
    }

    // Check non-flush hands
    const rankValues = Object.values(rankCounts);
    if (rankValues.includes(5)) {
      return this.createHandResult(HandType.FiveOfAKind, cards, cards);
    }

    if (rankValues.includes(4)) {
      const rank = Object.entries(rankCounts).find(
        ([, count]) => count === 4
      )![0];
      const scoredCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === Number(rank)
      );
      return this.createHandResult(HandType.FourOfAKind, cards, scoredCards);
    }

    if (rankValues.includes(3) && rankValues.includes(2)) {
      return this.createHandResult(HandType.FullHouse, cards, cards);
    }

    if (isStraightHand) {
      return this.createHandResult(HandType.Straight, cards, cards);
    }

    if (rankValues.includes(3)) {
      const rank = Object.entries(rankCounts).find(
        ([, count]) => count === 3
      )![0];
      const scoredCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === Number(rank)
      );
      return this.createHandResult(HandType.ThreeOfAKind, cards, scoredCards);
    }

    const pairs = Object.entries(rankCounts).filter(([, count]) => count === 2);
    if (pairs.length === 2) {
      const scoredCards = cards.filter((card) =>
        pairs.some(([rank]) => CARD_RANKS[card.rank] === Number(rank))
      );
      return this.createHandResult(HandType.TwoPair, cards, scoredCards);
    }

    if (pairs.length === 1) {
      const rank = pairs[0][0];
      const scoredCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === Number(rank)
      );
      return this.createHandResult(HandType.Pair, cards, scoredCards);
    }

    // High card (no other hands matched)
    const highestCard =
      cards.find(
        (card) => CARD_RANKS[card.rank] === CARD_RANKS[CardRank.ACE]
      ) ??
      [...cards].sort((a, b) => CARD_RANKS[b.rank] - CARD_RANKS[a.rank])[0];
    return this.createHandResult(HandType.HighCard, cards, [highestCard]);
  }

  // Helper method to create consistent hand results
  private static createHandResult(
    handType: HandType,
    cards: CardPosition[],
    scoredCards: CardPosition[]
  ): PokerHand & { scoredCards: CardPosition[] } {
    const { mult, chips } = HAND_VALUES[handType];
    return { handType, mult, chips, cards, scoredCards };
  }

  private static getRankCounts(cards: CardPosition[]): Record<number, number> {
    return cards.reduce((counts, card) => {
      counts[CARD_RANKS[card.rank]] = (counts[CARD_RANKS[card.rank]] || 0) + 1;
      return counts;
    }, {} as Record<number, number>);
  }

  private static isFlush(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    if (cards.length !== 5) return { isValid: false, scoredCards: [] };

    const isAllSameSuit = cards.every((card) => card.suit === cards[0].suit);
    return {
      isValid: isAllSameSuit,
      scoredCards: isAllSameSuit ? cards : [],
    };
  }

  private static isStraight(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    if (cards.length !== 5) return { isValid: false, scoredCards: [] };

    // Sort cards by rank, handling Ace (1) as both low and high
    const sortedRanks = cards
      .map((card) => CARD_RANKS[card.rank])
      .sort((a, b) => a - b);

    // Check for A-5 straight
    if (
      sortedRanks[0] === CARD_RANKS[CardRank.ACE] &&
      sortedRanks[1] === 2 &&
      sortedRanks[2] === 3 &&
      sortedRanks[3] === 4 &&
      sortedRanks[4] === 5
    ) {
      return { isValid: true, scoredCards: cards };
    }

    // Check for regular straight (including A-K)
    for (let i = 1; i < sortedRanks.length; i++) {
      if (sortedRanks[i] !== sortedRanks[i - 1] + 1) {
        return { isValid: false, scoredCards: [] };
      }
    }

    return { isValid: true, scoredCards: cards };
  }
}
