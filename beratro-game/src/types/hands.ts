import { HandType } from "@/utils/constants";
import { CardPosition } from "./cards";

export type PokerHand = {
  handType: HandType;
  mult: number;
  chips: number;
  cards: CardPosition[];
};
