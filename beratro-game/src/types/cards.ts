import { CardRank, CardSuit, Flower, Meme, Sticker } from "@/utils/constants";

export interface CardPosition {
  id: string;
  rank: CardRank;
  suit: CardSuit;
  index: number;
  chips?: number;
  mult?: number;
  xMult?: number;
  animalSticker?: Sticker;
  fruitSticker?: Sticker;
}

export interface BoosterPosition {
  id: string;
  booster: Flower | Sticker | Meme;
  boosterType: "flower" | "sticker" | "meme";
  index: number;
}
