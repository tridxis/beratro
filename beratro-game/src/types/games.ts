import { Bera, Flower, HandType, Meme, Sticker } from "@/utils/constants";
import { BoosterPosition, CardPosition } from "./cards";
import { BeraPosition } from "./beras";

export enum GameState {
  BERAS_PICKING = "BERAS_PICKING",
  PLAYING = "PLAYING",
  ROUND_ENDED = "ROUND_ENDED",
  SHOPPING = "SHOPPING",
  GAME_ENDED = "GAME_ENDED",
}

export interface GameStore {
  gameBeras: Bera[];
  playingBeras: BeraPosition[];
  deckBeras: BeraPosition[];
  handCards: CardPosition[];
  deckCards: CardPosition[];
  selectedCards: number[];
  playedHands: CardPosition[][];
  discards: CardPosition[][];
  removedCards: CardPosition[][];
  addedCards: CardPosition[][];
  maxHands: number;
  maxDiscards: number;
  maxBoosters: number;
  maxBeras: number;
  usedFlowers: Flower[];
  usedStickers: Sticker[];
  usedMemes: Meme[];
  score: number;
  round: number;
  roundGold: number;
  reqScore: number;
  boosters: BoosterPosition[];
  currentState: GameState;
  lastHandType: HandType | null;
  setCurrentState: (state: GameState) => void;
  reset: () => void;
  setHandCards: (cards: CardPosition[]) => void;
  setDeckCards: (cards: CardPosition[]) => void;
  setSelectedCards: (selectedCards: number[]) => void;
  toggleSelectedCard: (id: number) => void;
  sortByValue: () => void;
  sortBySuit: () => void;
  reorderCards: (newOrder: number[]) => void;
  dealCards: (count?: number) => void;
  playSelectedCards: () => void;
  setLastHandType: (handType: HandType) => void;
  discardSelectedCards: () => void;
  setMaxHands: (value: number) => void;
  setMaxDiscards: (value: number) => void;
  addScore: (points: number) => void;
  shopBeras: BeraPosition[];
  gold: number;
  endRound: (goldEarned: number) => void;
  buyBera: (id: number) => void;
  removeCards: (cards?: CardPosition[]) => void;
  useBooster: (booster: BoosterPosition) => void;
  modifyGold: (value: number) => void;
  addBooster: (booster: Flower | Sticker | Meme) => void;
  addCardsToDeck: (cards: CardPosition[]) => void;
  addCardsToHand: (cards: CardPosition[]) => void;
  modifyCards: (value: { chips?: number; mult?: number }) => void;
  convertCards: (ids: number[], card: Partial<CardPosition>) => void;
  nextRound: () => void;
}

export type CalculationOption = {
  breakdown?: boolean;
  isInHand?: boolean;
  isScored?: boolean;
  retrigger?: boolean;
};
