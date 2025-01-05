import { CardRank, CardSuit } from "@/utils/constants";

export interface CardPosition {
  id: number;
  rank: CardRank;
  suit: CardSuit;
}
