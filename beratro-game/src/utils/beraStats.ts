import { Bera } from "./constants";

export enum BeraType {
  PLUS_CHIPS = "PLUS_CHIPS",
  PLUS_MULT = "PLUS_MULT",
  PLUS_GOLD = "PLUS_GOLD",
  MULT_MULT = "MULT_MULT",
  GEN_FLOWER = "GEN_FLOWER",
  GEN_MEME = "GEN_MEME",
  GEN_STICKER = "GEN_STICKER",
  GEN_CARD = "GEN_CARD",
  RETRIGGER = "RETRIGGER",
}

export enum BeraAction {
  INDEP = "INDEP",
  ON_HELD = "ON_HELD",
  ON_PLAYED = "ON_PLAYED",
  ON_DISCARD = "ON_DISCARD",
  ON_SCORED = "ON_SCORED",
  ON_REMOVED = "ON_REMOVED",
  ON_ADDED = "ON_ADDED",
}

export enum BeraRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export const BERA_STATS = {
  [Bera.BABY]: {
    name: "Baby",
    description: "BABY",
    cost: 2,
    rarity: BeraRarity.COMMON,
    values: [4, 8, 16],
    type: BeraType.PLUS_MULT,
    action: BeraAction.INDEP,
  },
  [Bera.HEART]: {
    name: "Heart",
    description: "HEART",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.PLUS_MULT,
    action: BeraAction.ON_SCORED,
  },
  [Bera.DIAMOND]: {
    name: "Diamond",
    description: "DIAMOND",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.PLUS_MULT,
    action: BeraAction.ON_SCORED,
  },
  [Bera.CLUB]: {
    name: "Club",
    description: "CLUB",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.PLUS_MULT,
    action: BeraAction.ON_SCORED,
  },
  [Bera.SPADE]: {
    name: "Spade",
    description: "SPADE",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.PLUS_MULT,
    action: BeraAction.ON_SCORED,
  },
  [Bera.TWINS]: {
    name: "Twins",
    description: "TWINS",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [50, 75, 100],
    type: BeraType.PLUS_CHIPS,
    action: BeraAction.INDEP,
  },
  [Bera.TRIPLETS]: {
    name: "Triplets",
    description: "TRIPLETS",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [100, 150, 200],
    type: BeraType.PLUS_CHIPS,
    action: BeraAction.INDEP,
  },
  [Bera.CLIMB]: {
    name: "Climb",
    description: "CLIMB",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [100, 150, 200],
    type: BeraType.PLUS_CHIPS,
    action: BeraAction.INDEP,
  },
  [Bera.UNIFORM]: {
    name: "Uniform",
    description: "UNIFORM",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [80, 120, 160],
    type: BeraType.PLUS_CHIPS,
    action: BeraAction.INDEP,
  },
  [Bera.DOUBLES]: {
    name: "Doubles",
    description: "DOUBLES",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [8, 12, 16],
    type: BeraType.PLUS_MULT,
    action: BeraAction.INDEP,
  },
  [Bera.FAMILY]: {
    name: "Family",
    description: "FAMILY",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [12, 16, 20],
    type: BeraType.PLUS_MULT,
    action: BeraAction.INDEP,
  },
  [Bera.BUILDER]: {
    name: "Builder",
    description: "BUILDER",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [12, 16, 20],
    type: BeraType.PLUS_MULT,
    action: BeraAction.INDEP,
  },
  [Bera.COLORLESS]: {
    name: "Colorless",
    description: "COLORLESS",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [10, 15, 20],
    type: BeraType.PLUS_MULT,
    action: BeraAction.INDEP,
  },
  [Bera.PERFECTION]: {
    name: "Perfection",
    description: "PERFECTION",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [100, 150, 200],
    type: BeraType.PLUS_CHIPS,
    action: BeraAction.ON_SCORED,
  },
  [Bera.MUSKETEERS]: {
    name: "Musketeers",
    description: "MUSKETEERS",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [3, 4, 5],
    type: BeraType.MULT_MULT,
    action: BeraAction.INDEP,
  },
  [Bera.MOTHER_CARE]: {
    name: "Mother Care",
    description: "MOTHER_CARE",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [3, 2, 1],
    type: BeraType.GEN_FLOWER,
    action: BeraAction.ON_SCORED,
  },
  [Bera.CROWN]: {
    name: "Crown",
    description: "CROWN",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [1.5, 2, 2.5],
    type: BeraType.MULT_MULT,
    action: BeraAction.ON_HELD,
  },
  [Bera.AIRDROP]: {
    name: "Airdrop",
    description: "AIRDROP",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [0.25, 0.5, 0.75],
    type: BeraType.MULT_MULT,
    action: BeraAction.INDEP,
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
};
