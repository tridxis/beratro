import { type CardPosition } from "@/types/cards";
import {
  Bera,
  CARD_RANKS,
  CardRank,
  HAND_VALUES,
  HandType,
  Unit,
} from "@/utils/constants";
import { Breakdown, type PokerHand } from "@/types/hands";
import { BeraPosition } from "@/types/beras";

type CalculationOption = {
  breakdown?: boolean;
};

export class Calculator {
  static calculateScore(
    playingCards: CardPosition[],
    inHandCards: CardPosition[],
    beras: BeraPosition[],
    options?: CalculationOption
  ): {
    score: number;
    playingBreakdowns: Breakdown[];
    inHandBreakdowns: Breakdown[];
    pokerHand: PokerHand;
  } {
    const pokerHand = this.identifyPokerHand(playingCards);
    let totalMult = pokerHand.mult;
    let totalChips = pokerHand.chips;
    const { chips, mult, playingBreakdowns } = this.triggerPlayingCards(
      pokerHand.scoredCards,
      beras,
      totalChips,
      totalMult,
      options
    );

    totalMult *= mult;
    totalChips += chips;

    for (let i = 0; i < beras.length; i++) {
      const bera = beras[i];
      if (bera.bera === Bera.TEST_MULT) {
        totalMult *= 3;
        if (options?.breakdown) {
          playingBreakdowns.push({
            cards: [],
            beras: [bera.id],
            values: [3],
            units: [Unit.MULT],
            chips: totalChips,
            mult: totalMult,
          });
        }
      }
    }

    const {
      chips: inHandChips,
      mult: inHandMult,
      inHandBreakdowns,
    } = this.triggerInHandCards(
      inHandCards,
      beras,
      totalChips,
      totalMult,
      options
    );

    totalMult *= inHandMult;
    totalChips += inHandChips;

    return {
      score: totalChips * totalMult,
      playingBreakdowns,
      inHandBreakdowns,
      pokerHand: pokerHand,
    };
  }

  private static triggerPlayingCards(
    cards: CardPosition[],
    beras: BeraPosition[],
    startingChips: number,
    startingMult: number,
    options?: CalculationOption
  ): {
    chips: number;
    mult: number;
    playingBreakdowns: Breakdown[];
  } {
    const playingBreakdowns: Breakdown[] = [];
    let chips = 0;
    const mult = 1;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let value = 0;
      // Face cards (J, Q, K) are worth 10, Ace is worth 11
      if (CARD_RANKS[card.rank] === CARD_RANKS[CardRank.ACE]) {
        value = 11;
      } else if (CARD_RANKS[card.rank] > 10) {
        value = 10;
      } else {
        value = CARD_RANKS[card.rank];
      }
      chips += value;
      if (options?.breakdown) {
        playingBreakdowns.push({
          cards: [card.id],
          beras: [],
          values: [value],
          units: [Unit.CHIPS],
          chips: startingChips + chips,
          mult: startingMult * mult,
        });
      }
      for (let j = 0; j < beras.length; j++) {
        const bera = beras[j];
        if (bera.bera === Bera.TEST_CHIPS) {
          chips += 30;
          if (options?.breakdown) {
            playingBreakdowns.push({
              cards: [],
              beras: [bera.id],
              values: [30],
              units: [Unit.CHIPS],
              chips: startingChips + chips,
              mult: startingMult * mult,
            });
          }
        }
      }
    }

    return { chips, mult, playingBreakdowns };
  }

  private static triggerInHandCards(
    cards: CardPosition[],
    beras: BeraPosition[],
    startingChips: number,
    startingMult: number,
    options?: CalculationOption
  ): {
    chips: number;
    mult: number;
    inHandBreakdowns: Breakdown[];
  } {
    const inHandBreakdowns: Breakdown[] = [];
    const chips = 0;
    let mult = 1;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      for (let j = 0; j < beras.length; j++) {
        const bera = beras[j];
        if (bera.bera === Bera.TEST_IN_HAND) {
          if (card.rank === CardRank.KING) {
            mult *= 1.5;
            if (options?.breakdown) {
              inHandBreakdowns.push({
                cards: [card.id],
                beras: [bera.id],
                values: [1.5],
                units: [Unit.MULT],
                chips: startingChips + chips,
                mult: startingMult * mult,
              });
            }
          }
        }
      }
    }

    return { chips, mult, inHandBreakdowns };
  }

  static identifyPokerHand(
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
    const counts = Object.values(rankCounts);
    if (counts.includes(5)) {
      return this.createHandResult(HandType.FiveOfAKind, cards, cards);
    }

    if (counts.includes(4)) {
      const rank = Object.entries(rankCounts).find(
        ([, count]) => count === 4
      )![0];
      const scoredCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === Number(rank)
      );
      return this.createHandResult(HandType.FourOfAKind, cards, scoredCards);
    }

    if (counts.includes(3) && counts.includes(2)) {
      return this.createHandResult(HandType.FullHouse, cards, cards);
    }

    if (isStraightHand) {
      return this.createHandResult(HandType.Straight, cards, cards);
    }

    if (counts.includes(3)) {
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
