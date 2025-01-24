export const ANIMATION_MS = 360;

export enum Bera {
  BABY = "BABY",
  HEART = "HEART",
  DIAMOND = "DIAMOND",
  CLUB = "CLUB",
  SPADE = "SPADE",
  TWINS = "TWINS",
  TRIPLETS = "TRIPLETS",
  CLIMB = "CLIMB",
  UNIFORM = "UNIFORM",
  DOUBLES = "DOUBLES",
  FAMILY = "FAMILY",
  BUILDER = "BUILDER",
  COLORLESS = "COLORLESS",
  CHIP = "CHIP",
  MAGNET = "MAGNET",
  BAG = "BAG",
  SCARF = "SCARF",
  HAT = "HAT",
  LUSCIOUS = "LUSCIOUS",
  BADGE = "BADGE",
  SHY = "SHY",
  NOPE = "NOPE",
  BIG_TINY = "BIG_TINY",
  GIFT = "GIFT",
  FISH = "FISH",
  BAKER = "BAKER",
  CRAWL = "CRAWL",
  STAMMER = "STAMMER",
  STAR = "STAR",
  DROOL = "DROOL",
  SLEEP = "SLEEP",
  STRONG = "STRONG",
  CLOUD = "CLOUD",
  SOCKS = "SOCKS",
  X = "X",
  PERFECTION = "PERFECTION",
  MUSKETEERS = "MUSKETEERS",
  MOTHER_CARE = "MOTHER_CARE",
  CROWN = "CROWN",
  AIRDROP = "AIRDROP",
}

export enum Flower {
  TULIP = "TULIP", // High card
  POPPY = "POPPY", // Pair
  JASMINE = "JASMINE", // Two pai
  TRILLIUM = "TRILLIUM", // Three of a kind
  LAVENDER = "LAVENDER", // Straight
  DAISY = "DAISY", // Flush
  VIOLET = "VIOLET", // Full house
  CLOVER = "CLOVER", // Four of a kind
  ORCHID = "ORCHID", // Straigh Flush
  LOTUS = "LOTUS", // Flush Five
  BLOSSOM = "BLOSSOM", // Five of a kind
  SUNFLOWER = "SUNFLOWER", // Flush house
}

export const FLOWERS = Object.values(Flower);

export enum Sticker {
  NONE = "NONE",
  STICKER_1 = "STICKER_1",
  STICKER_2 = "STICKER_2",
  STICKER_3 = "STICKER_3",
}

export const STICKERS = Object.values(Sticker);

export enum Meme {
  THIS = "THIS", // convert 1 to 1
  WASTED = "WASTED", // remove 2
  STRONG_BONK = "STRONG_BONK", // increase level of 2
  SILLY_DRAGON = "SILLY_DRAGON", // convert 3 to 1 in 3
  SPIDER_POINTING = "SPIDER_POINTING", // clone 1
  HEART_TRIGGED = "HEART_TRIGGED", // convert 3 to Heart
  DARKER = "DARKER", // convert 3 to Spade
  GALAXY_BRAIN = "GALAXY_BRAIN", // convert 3 to Club
  SEAGULL = "SEAGULL", // convert 3 to Diamond
  BEAR_SUIT = "BEAR_SUIT", // Sell value Beras to $
  BALLOON = "BALLOON", // Double gold, max 20
  LAST_PLACE = "LAST_PLACE", // randomly remove 5, get 20$
}

export const MEMES = Object.values(Meme);

export enum Unit {
  CHIPS = "CHIPS",
  MULT = "MULT",
  X_MULT = "X_MULT",
  GOLD = "GOLD",
  MEME = "MEME",
  FLOWER = "FLOWER",
  STICKER = "STICKER",
  RETRIGGER = "RETRIGGER",
}

type MultType = Unit.MULT | Unit.X_MULT;

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
  [CardRank.ACE]: 14,
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
  FlushFive = "Flush Five",
  FlushHouse = "Flush House",
  FiveOfAKind = "Five of a Kind",
  StraightFlush = "Straight Flush",
  FourOfAKind = "Four of a Kind",
  FullHouse = "Full House",
  Flush = "Flush",
  Straight = "Straight",
  ThreeOfAKind = "Three of a Kind",
  TwoPair = "Two Pair",
  Pair = "Pair",
  HighCard = "High Card",
}

export const HAND_VALUES: Record<
  HandType,
  {
    mult: number;
    chips: number;
    multLvl: number; // mult per level
    chipsLvl: number; // chips per level
  }
> = {
  [HandType.FlushFive]: { mult: 16, chips: 160, multLvl: 3, chipsLvl: 50 },
  [HandType.FlushHouse]: { mult: 14, chips: 140, multLvl: 4, chipsLvl: 40 },
  [HandType.FiveOfAKind]: { mult: 12, chips: 120, multLvl: 3, chipsLvl: 35 },
  [HandType.StraightFlush]: { mult: 8, chips: 100, multLvl: 4, chipsLvl: 40 },
  [HandType.FourOfAKind]: { mult: 7, chips: 60, multLvl: 3, chipsLvl: 30 },
  [HandType.FullHouse]: { mult: 4, chips: 40, multLvl: 2, chipsLvl: 25 },
  [HandType.Flush]: { mult: 4, chips: 35, multLvl: 2, chipsLvl: 15 },
  [HandType.Straight]: { mult: 4, chips: 30, multLvl: 3, chipsLvl: 30 },
  [HandType.ThreeOfAKind]: { mult: 3, chips: 30, multLvl: 2, chipsLvl: 20 },
  [HandType.TwoPair]: { mult: 2, chips: 20, multLvl: 1, chipsLvl: 20 },
  [HandType.Pair]: { mult: 2, chips: 10, multLvl: 1, chipsLvl: 15 },
  [HandType.HighCard]: { mult: 1, chips: 5, multLvl: 1, chipsLvl: 10 },
};

export const HAND_NAMES: Record<HandType, string> = {
  [HandType.FlushFive]: "Flush Five",
  [HandType.FlushHouse]: "Flush House",
  [HandType.FiveOfAKind]: "Five of a Kind",
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

export const DEFAULT_MAX_HANDS = 4;
export const DEFAULT_MAX_DISCARDS = 3;
export const DEFAULT_MAX_BOOSTERS = 2;
export const DEFAULT_MAX_BERAS = 5;
