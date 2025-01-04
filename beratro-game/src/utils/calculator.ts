import { type CardPosition } from "@/types/cards";
import { CARD_RANKS, HAND_VALUES, HandType } from "@/utils/constants";
import { type PokerHand } from "@/types/hands";

export class Calculator {
  static calculateScore(cards: CardPosition[]): number {
    const baseChips = this.calculateBaseChips(cards);
    const pokerHand = this.identifyPokerHand(cards);
    console.log(pokerHand);
    return (baseChips + pokerHand.chips) * pokerHand.mult;
  }

  private static calculateBaseChips(cards: CardPosition[]): number {
    return cards.reduce((sum, card) => {
      // Face cards (J, Q, K) are worth 10, Ace is worth 11
      if (CARD_RANKS[card.rank] === 1) return sum + 11;
      if (CARD_RANKS[card.rank] > 10) return sum + 10;
      return sum + CARD_RANKS[card.rank];
    }, 0);
  }

  private static identifyPokerHand(cards: CardPosition[]): PokerHand {
    const handChecks: Array<[() => boolean, HandType]> = [
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
      if (checkFn()) {
        const { mult, chips } = HAND_VALUES[handType];
        return { handType, mult, chips, cards };
      }
    }

    const { mult, chips } = HAND_VALUES[HandType.HighCard];
    return { handType: HandType.HighCard, mult, chips, cards };
  }

  private static isRoyalFlush(cards: CardPosition[]): boolean {
    return (
      this.isFlush(cards) &&
      this.isStraight(cards) &&
      Math.max(...cards.map((c) => CARD_RANKS[c.rank])) === 13
    );
  }

  private static isStraightFlush(cards: CardPosition[]): boolean {
    return this.isFlush(cards) && this.isStraight(cards);
  }

  private static isFourOfAKind(cards: CardPosition[]): boolean {
    const rankCounts = this.getRankCounts(cards);
    return Object.values(rankCounts).some((count) => count === 4);
  }

  private static isFullHouse(cards: CardPosition[]): boolean {
    const rankCounts = this.getRankCounts(cards);
    const counts = Object.values(rankCounts);
    return counts.includes(3) && counts.includes(2);
  }

  private static isFlush(cards: CardPosition[]): boolean {
    const firstSuit = cards[0].suit;
    return cards.every((card) => card.suit === firstSuit);
  }

  private static isStraight(cards: CardPosition[]): boolean {
    const ranks = cards.map((c) => CARD_RANKS[c.rank]).sort((a, b) => a - b);

    // Check for Ace-high straight (A-K-Q-J-10)
    if (
      ranks[0] === 1 &&
      ranks[1] === 10 &&
      ranks[2] === 11 &&
      ranks[3] === 12 &&
      ranks[4] === 13
    ) {
      return true;
    }

    // Check for normal straight
    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i] !== ranks[i - 1] + 1) return false;
    }
    return true;
  }

  private static isThreeOfAKind(cards: CardPosition[]): boolean {
    const rankCounts = this.getRankCounts(cards);
    return Object.values(rankCounts).some((count) => count === 3);
  }

  private static isTwoPair(cards: CardPosition[]): boolean {
    const rankCounts = this.getRankCounts(cards);
    const pairs = Object.values(rankCounts).filter((count) => count === 2);
    return pairs.length === 2;
  }

  private static isPair(cards: CardPosition[]): boolean {
    const rankCounts = this.getRankCounts(cards);
    return Object.values(rankCounts).some((count) => count === 2);
  }

  private static getRankCounts(cards: CardPosition[]): Record<number, number> {
    return cards.reduce((counts, card) => {
      counts[CARD_RANKS[card.rank]] = (counts[CARD_RANKS[card.rank]] || 0) + 1;
      return counts;
    }, {} as Record<number, number>);
  }
}
