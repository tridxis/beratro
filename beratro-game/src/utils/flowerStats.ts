import { Flower, HandType } from "./constants";

export type FlowerStats = {
  title: string;
  hand: HandType;
  id: number;
};

export const FLOWER_STATS: Record<Flower, FlowerStats> = {
  [Flower.TULIP]: {
    title: "Tulip",
    hand: HandType.HighCard,
    id: 1,
  },
  [Flower.POPPY]: {
    title: "Poppy",
    hand: HandType.Pair,
    id: 2,
  },
  [Flower.JASMINE]: {
    title: "Jasmine",
    hand: HandType.TwoPair,
    id: 3,
  },
  [Flower.TRILLIUM]: {
    title: "Trillium",
    hand: HandType.ThreeOfAKind,
    id: 4,
  },
  [Flower.LAVENDER]: {
    title: "Lavender",
    hand: HandType.Straight,
    id: 5,
  },
  [Flower.DAISY]: {
    title: "Daisy",
    hand: HandType.Flush,
    id: 6,
  },
  [Flower.VIOLET]: {
    title: "Violet",
    hand: HandType.FullHouse,
    id: 7,
  },
  [Flower.CLOVER]: {
    title: "Clover",
    hand: HandType.FourOfAKind,
    id: 8,
  },
  [Flower.ORCHID]: {
    title: "Orchid",
    hand: HandType.StraightFlush,
    id: 9,
  },
  [Flower.LOTUS]: {
    title: "Lotus",
    hand: HandType.FlushFive,
    id: 10,
  },
  [Flower.BLOSSOM]: {
    title: "Blossom",
    hand: HandType.FiveOfAKind,
    id: 11,
  },
  [Flower.SUNFLOWER]: {
    title: "Sunflower",
    hand: HandType.FlushHouse,
    id: 12,
  },
};
