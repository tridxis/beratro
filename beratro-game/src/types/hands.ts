import { HandType, Unit } from "@/utils/constants";
import { CardPosition } from "./cards";

export type PokerHand = {
  handType: HandType;
  chips: number;
  mult: number;
  cards: CardPosition[];
};

export type Breakdown = {
  cards: string[];
  beras: string[];
  values: number[];
  units: Unit[];
  chips: number;
  mult: number;
};
