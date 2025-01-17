/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalculationOption } from "@/types/hands";
import { Bera, CARD_RANKS, CardRank, CardSuit } from "./constants";
import { CardPosition } from "@/types/cards";
import { countRanks, getRankCounts, isFlush, isStraight } from "./atomic";

export enum BeraType {
  ADD_CHIPS = "ADD_CHIPS",
  ADD_MULT = "ADD_MULT",
  ADD_GOLD = "ADD_GOLD",
  MUL_MULT = "MUL_MULT",
  GEN_FLOWER = "GEN_FLOWER",
  GEN_MEME = "GEN_MEME",
  GEN_STICKER = "GEN_STICKER",
  GEN_CARD = "GEN_CARD",
  RETRIGGER = "RETRIGGER",
  INCREASE_CHIPS = "INCREASE_CHIPS",
  INCREASE_MULT = "INCREASE_MULT",
  UPDATE_HAND = "UPDATE_HAND",
}

export enum BeraAction {
  INDEP = "INDEP",
  ON_HELD = "ON_HELD",
  ON_PLAYED = "ON_PLAYED",
  ON_DISCARD = "ON_DISCARD",
  ON_SCORED = "ON_SCORED",
  ON_REMOVED = "ON_REMOVED",
  ON_ADDED = "ON_ADDED",
  ON_ENDED = "ON_ENDED",
}

export enum BeraRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export const BERA_STATS: Record<Bera, BeraStats> = {
  [Bera.BABY]: {
    name: "Baby",
    description: "+4 Mult",
    cost: 2,
    rarity: BeraRarity.COMMON,
    values: [4, 8, 16],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return value;
    },
  },
  [Bera.HEART]: {
    name: "Heart",
    description: "Played cards with Heart suit give {{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    condition: (value: number, card: CardPosition) => {
      return card.suit === CardSuit.HEARTS ? value : 0;
    },
  },
  [Bera.DIAMOND]: {
    name: "Diamond",
    description:
      "Played cards with Diamond suit give {{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    condition: (value: number, card: CardPosition) => {
      return card.suit === CardSuit.DIAMONDS ? value : 0;
    },
  },
  [Bera.CLUB]: {
    name: "Club",
    description: "Played cards with Club suit give +{{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    condition: (value: number, card: CardPosition) => {
      return card.suit === CardSuit.CLUBS ? value : 0;
    },
  },
  [Bera.SPADE]: {
    name: "Spade",
    description:
      "Played cards with Spade suit give +{{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    condition: (value: number, card: CardPosition) => {
      return card.suit === CardSuit.SPADES ? value : 0;
    },
  },
  [Bera.TWINS]: {
    name: "Twins",
    description: "+{{value}} Chips if played hand contains a Pair",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [50, 75, 100],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return countRanks(options.playedCards).includes(2) ? value : 0;
    },
  },
  [Bera.TRIPLETS]: {
    name: "Triplets",
    description: "+{{value}} Chips if played hand contains a Three of a Kind",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [100, 150, 200],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return countRanks(options.playedCards).includes(3) ? value : 0;
    },
  },
  [Bera.CLIMB]: {
    name: "Climb",
    description: "+{{value}} Chips if played hand contains a Straight",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [100, 150, 200],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return isStraight(options.playedCards).isValid ? value : 0;
    },
  },
  [Bera.UNIFORM]: {
    name: "Uniform",
    description: "+{{value}} Chips if played hand contains a Flush",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [80, 120, 160],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return isFlush(options.playedCards).isValid ? value : 0;
    },
  },
  [Bera.DOUBLES]: {
    name: "Doubles",
    description: "+{{value}} Mult if played hand contains a Pair",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [8, 12, 16],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return countRanks(options.playedCards).includes(2) ? value : 0;
    },
  },
  [Bera.FAMILY]: {
    name: "Family",
    description: "+{{value}} Mult if played hand contains a Three of a Kind",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [12, 16, 20],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return countRanks(options.playedCards).includes(3) ? value : 0;
    },
  },
  [Bera.BUILDER]: {
    name: "Builder",
    description: "+{{value}} Mult if played hand contains a Four of a Straight",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [12, 16, 20],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return isStraight(options.playedCards).isValid ? value : 0;
    },
  },
  [Bera.COLORLESS]: {
    name: "Colorless",
    description: "+{{value}} Mult if played hand contains a Flush",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [10, 15, 20],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return isFlush(options.playedCards).isValid ? value : 0;
    },
  },
  [Bera.PERFECTION]: {
    name: "Perfection",
    description:
      "Each played 10 gives +{{value}} Chips when scored if only 10 played",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [100, 150, 200],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.ON_SCORED,
    condition: (value: number, options: CalculationOption) => {
      return options.playedCards.every((card) => card.rank === CardRank.TEN)
        ? value
        : 0;
    },
  },
  [Bera.MUSKETEERS]: {
    name: "Musketeers",
    description:
      "x{{value}} Mult if played hand contains a Three of a Kind of J",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [3, 4, 5],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      const rankCounts = getRankCounts(options.playedCards);
      return rankCounts[CARD_RANKS[CardRank.JACK]] >= 3 ? value : 0;
    },
  },
  [Bera.MOTHER_CARE]: {
    name: "Mother Care",
    description:
      " 1 in {{value}} chance for each played Q to create a Flower card when scored",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [3, 2, 1],
    type: BeraType.GEN_FLOWER,
    action: BeraAction.ON_SCORED,
    condition: (value: number, card: CardPosition & { beraValue: number }) => {
      if (card.rank === CardRank.QUEEN) {
        return Math.random() < 1 / card.beraValue ? value : 0;
      }
      return 0;
    },
  },
  [Bera.CROWN]: {
    name: "Crown",
    description: "Each King held in hand gives x{{value}} Mult",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [1.5, 2, 2.5],
    type: BeraType.MUL_MULT,
    action: BeraAction.ON_HELD,
    condition: (value: number, card: CardPosition & { beraValue: number }) => {
      return card.rank === CardRank.KING ? value : 0;
    },
  },
  [Bera.AIRDROP]: {
    name: "Airdrop",
    description: "Gains x{{value}} Mult for every A that is removed",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [1, 1.5, 2],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      const removedAces = options.removedCards
        .flat()
        .filter((card) => card.rank === CardRank.ACE);
      return removedAces.length > 0 ? value * removedAces.length : 0;
    },
  },
  [Bera.CHIP]: {
    name: "Chip",
    description: "+{{value}} Mult if played hand contains 3 or fewer cards",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [20, 30, 40],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return options.playedCards.length <= 3 ? value : 0;
    },
  },
  [Bera.CRAWL]: {
    name: "Crawl",
    description: "x{{value}} Mult if played hand contains 4 cards",
    cost: 5,
    rarity: BeraRarity.UNCOMMON,
    values: [2, 3, 4],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    condition: (value: number, options: CalculationOption) => {
      return options.playedCards.length === 4 ? value : 0;
    },
  },
  [Bera.FISH]: {
    name: "Fish",
    description: "Each A card held in hand will get ${{value}}",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_HELD,
    condition: (value: number, options: CalculationOption) => {
      const aces = options.inHandCards.filter(
        (card) => card.rank === CardRank.ACE
      );
      return aces.length > 0 ? value * aces.length : 0;
    },
  },
  [Bera.BAG]: {
    name: "Bag",
    description: "+{{value}} hand size, reduces by 1 each round",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [5, 7, 10],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_HELD,
    condition: (value: number, options: CalculationOption) => {
      return options.maxHands - options.playedHands.length > 0 ? value : 0;
    },
  },
  [Bera.SCARF]: {
    name: "Scarf",
    description: "+{{value}} Chips for each remaining discard",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [30, 40, 50],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    multiplier: (options: CalculationOption) =>
      options.maxDiscards - options.discards.length,
    condition: (value: number) => 1,
  },
  [Bera.HAT]: {
    name: "Hat",
    description:
      "Each {{value}} card held in hand has a 1 in {{value}} chance to give $1",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 2, 1],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_HELD,
    condition: (value: number) => 1,
  },
  [Bera.LUSCIOUS]: {
    name: "Luscious",
    description: "Gains x{{value}} Mult every time a Flower is used",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [0.1, 0.2, 0.3],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    condition: (value: number) => 1,
  },
  [Bera.BADGE]: {
    name: "Gains {{value}} every time a playing card is added to the deck",
    description: "BADGE",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [0.25, 0.5, 0.75],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    condition: (value: number) => 1,
  },
  [Bera.SHY]: {
    name: "Shy",
    description: "+{{value}} Mult if played hand contains no face card",
    cost: 3,
    rarity: BeraRarity.UNCOMMON,
    values: [20, 30, 40],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number) => 1,
  },
  [Bera.NOPE]: {
    name: "Nope",
    description: "Gains x{{value}} Mult when any Booster Pack is skipped",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [0.1, 0.2, 0.3],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    condition: (value: number) => 1,
  },
  [Bera.BIG_TINY]: {
    name: "Big Tiny",
    description: "Retrigger {{value}} times all played cards less than 10",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.RETRIGGER,
    action: BeraAction.INDEP,
    condition: (value: number) => 1,
  },
  [Bera.GIFT]: {
    name: "Gift",
    description: "Earn ${{value}} at end of round",
    cost: 6,
    rarity: BeraRarity.COMMON,
    values: [4, 6, 8],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_ENDED,
    condition: (value: number) => 1,
  },
  [Bera.MAGNET]: {
    name: "Magnet",
    description:
      "{{value}} in 3 chance create a sticker if played hand contains a Flush",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.GEN_STICKER,
    action: BeraAction.ON_PLAYED,
    condition: (value: number) => 1,
  },
  [Bera.BAKER]: {
    name: "Baker",
    description: "Create a ${{value}} if played hand contains a Straight",
    cost: 5,
    rarity: BeraRarity.UNCOMMON,
    values: [5, 10, 15],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_PLAYED,
    condition: (value: number) => 1,
  },
  [Bera.SMILE]: {
    name: "Smile",
    description: "Retrigger all card held in hand abilities {{value}} times",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.RETRIGGER,
    action: BeraAction.ON_HELD,
    condition: (value: number) => 1,
  },
  [Bera.STAR]: {
    name: "Star",
    description: "Gains x{{value}} Mult for each star of playing Beras",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [0.25, 0.5, 0.75],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    condition: (value: number) => 1,
  },
  [Bera.DROOL]: {
    name: "Drool",
    description: "First played face card gives x{{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [2, 3, 4],
    type: BeraType.MUL_MULT,
    action: BeraAction.ON_SCORED,
    condition: (value: number) => 1,
  },
  [Bera.SLEEP]: {
    name: "Sleep",
    description:
      "Upgrade the level of the first discarded poker hand each round by {{value}}",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [1, 2, 3],
    type: BeraType.UPDATE_HAND,
    action: BeraAction.ON_DISCARD,
    condition: (value: number) => 1,
  },
  [Bera.STRONG]: {
    name: "Strong",
    description:
      "Every played card permanently gains +{{value}} Chips when scored",
    cost: 5,
    rarity: BeraRarity.UNCOMMON,
    values: [5, 10, 15],
    type: BeraType.INCREASE_CHIPS,
    action: BeraAction.ON_SCORED,
    condition: (value: number) => 1,
  },
  [Bera.CLOUD]: {
    name: "Cloud",
    description: "Earn ${{value}} for each 9 in your full deck at end of round",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_ENDED,
    condition: (value: number) => 1,
  },
  [Bera.SOCKS]: {
    name: "Socks",
    description: "Gains +{{value}} Mult if played hand contains a Two Pair",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [2, 3, 4],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    condition: (value: number) => 1,
  },
  [Bera.X]: {
    name: "X",
    description:
      "Earn ${{value}} for each discarded [rank], rank changes every round",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [5, 7, 10],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_DISCARD,
    condition: (value: number) => 1,
  },
};

// TypeScript type for the stats
export type BeraStats = {
  name: string;
  description: string;
  cost: number;
  rarity: BeraRarity;
  values: [number, number, number]; // tuple of 3 numbers
  type: BeraType;
  action: BeraAction;
  multiplier?: (options: CalculationOption) => number;
  condition: (value: number, data: any) => number;
};
