import { CardPosition } from "@/types/cards";
import { CARD_RANKS, CardRank } from "./constants";
import { GameStore } from "@/types/games";

export const isStraight = (
  cards: CardPosition[]
): {
  isValid: boolean;
  scoredCards: CardPosition[];
} => {
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
};

export const isFlush = (
  cards: CardPosition[]
): {
  isValid: boolean;
  scoredCards: CardPosition[];
} => {
  if (cards.length !== 5) return { isValid: false, scoredCards: [] };

  const isAllSameSuit = cards.every((card) => card.suit === cards[0].suit);
  return {
    isValid: isAllSameSuit,
    scoredCards: isAllSameSuit ? cards : [],
  };
};

export const getRankCounts = (
  cards: CardPosition[]
): Record<number, number> => {
  return cards.reduce((counts, card) => {
    counts[CARD_RANKS[card.rank]] = (counts[CARD_RANKS[card.rank]] || 0) + 1;
    return counts;
  }, {} as Record<number, number>);
};

export const countRanks = (cards: CardPosition[]): number[] => {
  return Object.values(getRankCounts(cards));
};
