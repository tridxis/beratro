export enum CardRank {
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
  JACK = "J",
  QUEEN = "Q",
  KING = "K",
  ACE = "A",
}

export enum CardSuit {
  HEARTS = "HEARTS",
  DIAMONDS = "DIAMONDS",
  CLUBS = "CLUBS",
  SPADES = "SPADES",
}

export const CARD_RANKS = {
  [CardRank.ACE]: 1,
  [CardRank.TWO]: 2,
  [CardRank.THREE]: 3,
  [CardRank.FOUR]: 4,
  [CardRank.FIVE]: 5,
  [CardRank.SIX]: 6,
  [CardRank.SEVEN]: 7,
  [CardRank.EIGHT]: 8,
  [CardRank.NINE]: 9,
  [CardRank.TEN]: 10,
  [CardRank.JACK]: 11,
  [CardRank.QUEEN]: 12,
  [CardRank.KING]: 13,
} as const;

export const SUIT_ORDER = {
  [CardSuit.HEARTS]: 1,
  [CardSuit.DIAMONDS]: 2,
  [CardSuit.CLUBS]: 3,
  [CardSuit.SPADES]: 4,
} as const;

export const SUIT_SYMBOLS = {
  [CardSuit.HEARTS]: "♥",
  [CardSuit.DIAMONDS]: "♦",
  [CardSuit.CLUBS]: "♣",
  [CardSuit.SPADES]: "♠",
} as const;

export enum HandType {
  RoyalFlush = "RoyalFlush",
  StraightFlush = "StraightFlush",
  FourOfAKind = "FourOfAKind",
  FullHouse = "FullHouse",
  Flush = "Flush",
  Straight = "Straight",
  ThreeOfAKind = "ThreeOfAKind",
  TwoPair = "TwoPair",
  Pair = "Pair",
  HighCard = "HighCard",
}

export const HAND_VALUES: Record<HandType, { mult: number; chips: number }> = {
  [HandType.RoyalFlush]: { mult: 9, chips: 150 },
  [HandType.StraightFlush]: { mult: 8, chips: 100 },
  [HandType.FourOfAKind]: { mult: 7, chips: 60 },
  [HandType.FullHouse]: { mult: 4, chips: 40 },
  [HandType.Flush]: { mult: 4, chips: 35 },
  [HandType.Straight]: { mult: 4, chips: 30 },
  [HandType.ThreeOfAKind]: { mult: 3, chips: 30 },
  [HandType.TwoPair]: { mult: 2, chips: 20 },
  [HandType.Pair]: { mult: 2, chips: 10 },
  [HandType.HighCard]: { mult: 1, chips: 5 },
};

export const HAND_NAMES: Record<HandType, string> = {
  [HandType.RoyalFlush]: "Royal Flush",
  [HandType.StraightFlush]: "Straight Flush",
  [HandType.FourOfAKind]: "Four of a Kind",
  [HandType.FullHouse]: "Full House",
  [HandType.Flush]: "Flush",
  [HandType.Straight]: "Straight",
  [HandType.ThreeOfAKind]: "Three of a Kind",
  [HandType.TwoPair]: "Two Pair",
  [HandType.Pair]: "Pair",
  [HandType.HighCard]: "High Card",
};
