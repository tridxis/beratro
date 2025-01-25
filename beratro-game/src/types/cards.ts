import { CardRank, CardSuit, Flower, Meme, Sticker } from "@/utils/constants";

export interface CardPosition {
  id: number;
  rank: CardRank;
  suit: CardSuit;
  index: number;
  chips?: number;
  mult?: number;
  xMult?: number;
}

export interface BoosterPosition {
  id: number;
  booster: Flower | Sticker | Meme;
  boosterType: "flower" | "sticker" | "meme";
  index: number;
}
