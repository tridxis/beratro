import { Bera } from "./constants";

export enum BeraType {
  PLUS_CHIPS = "PLUS_CHIPS",
  PLUS_MULT = "PLUS_MULT",
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

export const BERA_STATS = {
  [Bera.BABY]: {
    name: "Baby",
    description: "BABY",
  },
  [Bera.HEART]: {
    name: "Heart",
    description: "HEART",
  },
  [Bera.DIAMOND]: {
    name: "Diamond",
    description: "DIAMOND",
  },
  [Bera.CLUB]: {
    name: "Club",
    description: "CLUB",
  },
  [Bera.SPADE]: {
    name: "Spade",
    description: "SPADE",
  },
  [Bera.TWINS]: {
    name: "Twins",
    description: "TWINS",
  },
  [Bera.TRIPLETS]: {
    name: "Triplets",
    description: "TRIPLETS",
  },
  [Bera.CLIMB]: {
    name: "Climb",
    description: "CLIMB",
  },
  [Bera.UNIFORM]: {
    name: "Uniform",
    description: "UNIFORM",
  },
  [Bera.DOUBLES]: {
    name: "Doubles",
    description: "DOUBLES",
  },
  [Bera.FAMILY]: {
    name: "Family",
    description: "FAMILY",
  },
  [Bera.BUILDER]: {
    name: "Builder",
    description: "BUILDER",
  },
  [Bera.COLORLESS]: {
    name: "Colorless",
    description: "COLORLESS",
  },
  [Bera.CHIP]: {
    name: "Chip",
    description: "CHIP",
  },
  [Bera.MAGNET]: {
    name: "Magnet",
    description: "MAGNET",
  },
  [Bera.BAG]: {
    name: "Bag",
    description: "BAG",
  },
  [Bera.SCARF]: {
    name: "Scarf",
    description: "SCARF",
  },
  [Bera.HAT]: {
    name: "Hat",
    description: "HAT",
  },
  [Bera.LUSCIOUS]: {
    name: "Luscious",
    description: "LUSCIOUS",
  },
  [Bera.BADGE]: {
    name: "Badge",
    description: "BADGE",
  },
  [Bera.SHY]: {
    name: "Shy",
    description: "SHY",
  },
  [Bera.NOPE]: {
    name: "Nope",
    description: "NOPE",
  },
  [Bera.BIG_TINY]: {
    name: "Big Tiny",
    description: "BIG_TINY",
  },
  [Bera.GIFT]: {
    name: "Gift",
    description: "GIFT",
  },
  [Bera.FISH]: {
    name: "Fish",
    description: "FISH",
  },
  [Bera.BAKER]: {
    name: "Baker",
    description: "BAKER",
  },
  [Bera.CRAWL]: {
    name: "Crawl",
    description: "CRAWL",
  },
  [Bera.SMILE]: {
    name: "Smile",
    description: "SMILE",
  },
  [Bera.STAR]: {
    name: "Star",
    description: "STAR",
  },
  [Bera.DROOL]: {
    name: "Drool",
    description: "DROOL",
  },
  [Bera.SLEEP]: {
    name: "Sleep",
    description: "SLEEP",
  },
  [Bera.STRONG]: {
    name: "Strong",
    description: "STRONG",
  },
  [Bera.CLOUD]: {
    name: "Cloud",
    description: "CLOUD",
  },
  [Bera.SOCKS]: {
    name: "Socks",
    description: "SOCKS",
  },
  [Bera.X]: {
    name: "X",
    description: "X",
  },
  [Bera.PERFECTION]: {
    name: "Perfection",
    description: "PERFECTION",
  },
  [Bera.MUSKETEERS]: {
    name: "Musketeers",
    description: "MUSKETEERS",
  },
  [Bera.MOTHER_CARE]: {
    name: "Mother Care",
    description: "MOTHER_CARE",
  },
  [Bera.CROWN]: {
    name: "Crown",
    description: "CROWN",
  },
  [Bera.AIRDROP]: {
    name: "Airdrop",
    description: "AIRDROP",
  },
};
