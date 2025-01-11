import { HandType, Unit } from "@/utils/constants";
import { CardPosition } from "./cards";
import { BeraPosition } from "./beras";

export type PokerHand = {
  handType: HandType;
  chips: number;
  mult: number;
  cards: CardPosition[];
};

export type Breakdown = {
  cards: CardPosition[];
  beras: BeraPosition[];
  values: number[];
  units: Unit[];
  chips: number;
  mult: number;
};
