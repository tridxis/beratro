import { type CardPosition } from "@/types/cards";
import { CARD_RANKS, HAND_VALUES, HandType } from "@/utils/constants";
import { type PokerHand } from "@/types/hands";

export class Calculator {
  static calculateScore(cards: CardPosition[]): {
    score: number;
    scoredCards: (CardPosition & { chips: number[]; mults: number[] })[];
    handType: HandType;
  } {
    const pokerHand = this.identifyPokerHand(cards);
    const { baseChips, scoredCards } = this.calculateBaseChips(
      pokerHand.scoredCards
    );

    return {
      score: (baseChips + pokerHand.chips) * pokerHand.mult,
      scoredCards,
      handType: pokerHand.handType,
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
      if (CARD_RANKS[card.rank] === 1) {
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
    const handChecks: Array<
      [() => { isValid: boolean; scoredCards: CardPosition[] }, HandType]
    > = [
      [() => this.isRoyalFlush(cards), HandType.RoyalFlush],
      [() => this.isStraightFlush(cards), HandType.StraightFlush],
      [() => this.isFourOfAKind(cards), HandType.FourOfAKind],
      [() => this.isFullHouse(cards), HandType.FullHouse],
      [() => this.isFlush(cards), HandType.Flush],
      [() => this.isStraight(cards), HandType.Straight],
      [() => this.isThreeOfAKind(cards), HandType.ThreeOfAKind],
      [() => this.isTwoPair(cards), HandType.TwoPair],
      [() => this.isPair(cards), HandType.Pair],
    ];

    for (const [checkFn, handType] of handChecks) {
      const { isValid, scoredCards } = checkFn();
      if (isValid) {
        const { mult, chips } = HAND_VALUES[handType];
        return { handType, mult, chips, cards, scoredCards };
      }
    }

    // For high card, just take the highest value card
    const highestCard = [...cards].sort(
      (a, b) => CARD_RANKS[b.rank] - CARD_RANKS[a.rank]
    )[0];
    const { mult, chips } = HAND_VALUES[HandType.HighCard];
    return {
      handType: HandType.HighCard,
      mult,
      chips,
      cards,
      scoredCards: [highestCard],
    };
  }

  private static isFourOfAKind(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const rankCounts = this.getRankCounts(cards);
    for (const [rank, count] of Object.entries(rankCounts)) {
      if (count === 4) {
        const scoredCards = cards.filter(
          (card) => CARD_RANKS[card.rank] === Number(rank)
        );
        return { isValid: true, scoredCards };
      }
    }
    return { isValid: false, scoredCards: [] };
  }

  private static isThreeOfAKind(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const rankCounts = this.getRankCounts(cards);
    for (const [rank, count] of Object.entries(rankCounts)) {
      if (count === 3) {
        const scoredCards = cards.filter(
          (card) => CARD_RANKS[card.rank] === Number(rank)
        );
        return { isValid: true, scoredCards };
      }
    }
    return { isValid: false, scoredCards: [] };
  }

  private static isPair(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const rankCounts = this.getRankCounts(cards);
    for (const [rank, count] of Object.entries(rankCounts)) {
      if (count === 2) {
        const scoredCards = cards.filter(
          (card) => CARD_RANKS[card.rank] === Number(rank)
        );
        return { isValid: true, scoredCards };
      }
    }
    return { isValid: false, scoredCards: [] };
  }

  private static isTwoPair(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const rankCounts = this.getRankCounts(cards);
    const pairs = Object.entries(rankCounts).filter(
      ([_, count]) => count === 2
    );
    if (pairs.length === 2) {
      const scoredCards = cards.filter((card) =>
        pairs.some(([rank]) => CARD_RANKS[card.rank] === Number(rank))
      );
      return { isValid: true, scoredCards };
    }
    return { isValid: false, scoredCards: [] };
  }

  private static isFullHouse(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const rankCounts = this.getRankCounts(cards);
    const hasThree = Object.values(rankCounts).some((count) => count === 3);
    const hasPair = Object.values(rankCounts).some((count) => count === 2);
    if (hasThree && hasPair) {
      return { isValid: true, scoredCards: cards }; // All cards are used in a full house
    }
    return { isValid: false, scoredCards: [] };
  }

  private static isStraight(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const ranks = cards.map((c) => CARD_RANKS[c.rank]).sort((a, b) => a - b);

    if (ranks.length !== 5) {
      return { isValid: false, scoredCards: [] };
    }

    // Check for Ace-high straight
    if (
      ranks[0] === 1 &&
      ranks[1] === 10 &&
      ranks[2] === 11 &&
      ranks[3] === 12 &&
      ranks[4] === 13
    ) {
      return { isValid: true, scoredCards: cards };
    }

    // Check for normal straight
    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i] !== ranks[i - 1] + 1) {
        return { isValid: false, scoredCards: [] };
      }
    }
    return { isValid: true, scoredCards: cards };
  }

  private static isFlush(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const firstSuit = cards[0].suit;
    if (cards.length === 5 && cards.every((card) => card.suit === firstSuit)) {
      return { isValid: true, scoredCards: cards };
    }
    return { isValid: false, scoredCards: [] };
  }

  private static isStraightFlush(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const { isValid: isFlush } = this.isFlush(cards);
    const { isValid: isStraight } = this.isStraight(cards);
    if (isFlush && isStraight) {
      return { isValid: true, scoredCards: cards };
    }
    return { isValid: false, scoredCards: [] };
  }

  private static isRoyalFlush(cards: CardPosition[]): {
    isValid: boolean;
    scoredCards: CardPosition[];
  } {
    const { isValid: isStraightFlush } = this.isStraightFlush(cards);
    const hasAce = cards.some((c) => CARD_RANKS[c.rank] === 1);
    const hasKing = cards.some((c) => CARD_RANKS[c.rank] === 13);

    if (isStraightFlush && hasAce && hasKing) {
      return { isValid: true, scoredCards: cards };
    }
    return { isValid: false, scoredCards: [] };
  }

  private static getRankCounts(cards: CardPosition[]): Record<number, number> {
    return cards.reduce((counts, card) => {
      counts[CARD_RANKS[card.rank]] = (counts[CARD_RANKS[card.rank]] || 0) + 1;
      return counts;
    }, {} as Record<number, number>);
  }
}
