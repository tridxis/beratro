export const ANIMATION_MS = 360;

export enum GameAction {
  INDEP = "INDEP",
  ON_HELD = "ON_HELD",
  ON_PLAYED = "ON_PLAYED",
  ON_DISCARD = "ON_DISCARD",
  ON_SCORED = "ON_SCORED",
  ON_REMOVED = "ON_REMOVED",
  ON_ADDED = "ON_ADDED",
  ON_ENDED = "ON_ENDED",
  ON_RETRIGGERED = "ON_RETRIGGERED",
}

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
  STRAWBERRY = "STRAWBERRY", // add mult
  BLUEBERRY = "BLUEBERRY", // add chips
  CHILLI = "CHILLI", // mul mult when score
  TOMATO = "TOMATO", // mul mult when in hand
  BANANA = "BANANA", // wild card
  BEE = "BEE", // earn 3$ when score
  FROG = "FROG", // create meme when discard
  BUTTERFLY = "BUTTERFLY", // create the final hand flower when in hand
  PANDA = "PANDA", // retrigger
  EARTH = "EARTH", // add mult (bera)
  WATER = "WATER", // add chips (bera)
  FIRE = "FIRE", // mul mult (bera)
  AIR = "AIR", // 0 slot (bera)
}

export const STICKERS = Object.values(Sticker);

export enum Meme {
  THIS = "THIS", // Select 2 cards, convert the left card into the right card
  WASTED = "WASTED", // Remove up to 2 selected cards
  STRONG_BONK = "STRONG_BONK", // Increase rank of up to 2 selected cards by 1
  SILLY_DRAGON = "SILLY_DRAGON", // Change 3 selected cards to random card in 3 cards
  SPIDER_POINTING = "SPIDER_POINTING", // Clone 1 selected card
  HEART_TRIGGED = "HEART_TRIGGED", // Convert up to 3 selected cards to Heart
  DARKER = "DARKER", // Convert up to 3 cards to Spade
  GALAXY_BRAIN = "GALAXY_BRAIN", // Convert up to 3 cards to Club
  SEAGULL = "SEAGULL", // Convert up to 3 cards to Diamond
  BEAR_SUIT = "BEAR_SUIT", // Give the total sell value of all current Jokers (Max of $50)
  BALLOON = "BALLOON", // Double gold (Max of $20)
  LAST_PLACE = "LAST_PLACE", // Remove randomly 3 cards in hand, get 10$
  PEPE = "PEPE", // Create the last Meme Card used in this game
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
  WILD_CARD = "WILD_CARD",
  ZERO_SLOT = "ZERO_SLOT",
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

export enum BoosterPack {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ULTRA = "ULTRA",
}

export type BoosterPackInfo = {
  type: BoosterPack;
  name: string;
  price: number;
  items: number;
  pick: number;
};

export const BOOSTER_PACK_INFO: Record<BoosterPack, BoosterPackInfo> = {
  [BoosterPack.BASIC]: {
    type: BoosterPack.BASIC,
    name: "Basic Pack",
    price: 4,
    items: 5,
    pick: 1,
  },
  [BoosterPack.PREMIUM]: {
    type: BoosterPack.PREMIUM,
    name: "Premium Pack",
    price: 8,
    items: 8,
    pick: 1,
  },
  [BoosterPack.ULTRA]: {
    type: BoosterPack.ULTRA,
    name: "Ultra Pack",
    price: 12,
    items: 10,
    pick: 2,
  },
};

export const BOOSTER_PACKS = Object.values(BOOSTER_PACK_INFO);

export const DEFAULT_MAX_HANDS = 4;
export const DEFAULT_MAX_DISCARDS = 3;
export const DEFAULT_MAX_BOOSTERS = 3;
export const DEFAULT_MAX_BERAS = 5;
export const DEFAULT_REROLL_COST = 5;
