import { Bera, Flower } from "@/utils/constants";
import { CardPosition } from "./cards";
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
  usedFlowers: Flower[];
  score: number;
  currentState: GameState;
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
  discardSelectedCards: () => void;
  setMaxHands: (value: number) => void;
  setMaxDiscards: (value: number) => void;
  addScore: (points: number) => void;
  shopBeras: BeraPosition[];
  gold: number;
  endRound: (goldEarned: number) => void;
  buyBera: (id: number) => void;
  removeSelectedCards: () => void;
  useFlower: (flower: Flower) => void;
}

export type CalculationOption = {
  breakdown?: boolean;
};
