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
  cards: number[];
  beras: number[];
  values: number[];
  units: Unit[];
  chips: number;
  mult: number;
};

export type CalculationOption = {
  breakdown?: boolean;
  playedCards: CardPosition[];
  inHandCards: CardPosition[];
  playedHands: CardPosition[][];
  discards: CardPosition[][];
  playingBeras: BeraPosition[];
  maxHands: number;
  maxDiscards: number;
};
