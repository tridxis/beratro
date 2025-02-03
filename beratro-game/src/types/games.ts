import {
  Bera,
  BoosterPack,
  Flower,
  HandType,
  Meme,
  Sticker,
} from "@/utils/constants";
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
  selectedCards: string[];
  playedHands: CardPosition[][];
  allPlayedHands: CardPosition[][];
  discards: CardPosition[][];
  removedCards: CardPosition[][];
  addedCards: CardPosition[][];
  maxHands: number;
  getHandSize: () => number;
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
  handLevels: { [key: string]: number };
  selectedBera: string | null;
  setCurrentState: (state: GameState) => void;
  reset: () => void;
  setHandCards: (cards: CardPosition[]) => void;
  setDeckCards: (cards: CardPosition[]) => void;
  setSelectedCards: (selectedCards: string[]) => void;
  toggleSelectedCard: (id: string) => void;
  sortByValue: () => void;
  sortBySuit: () => void;
  reorderCards: (newOrder: string[]) => void;
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
  buyBera: (id: string) => void;
  removeCards: (cards?: CardPosition[]) => void;
  activateBooster: (booster: BoosterPosition) => void;
  modifyGold: (value: number) => void;
  addBooster: (
    booster: Flower | Sticker | Meme,
    boosterType: "flower" | "sticker" | "meme"
  ) => void;
  addCardsToDeck: (cards: CardPosition[]) => void;
  addCardsToHand: (cards: CardPosition[]) => void;
  modifyCards: (value: { chips?: number; mult?: number }) => void;
  convertCards: (ids: string[], card: Partial<CardPosition>) => void;
  nextRound: () => void;
  selectedPack: {
    boosterPack: BoosterPack;
    items: (CardPosition | BoosterPosition)[];
    pickedItems: string[];
  } | null;
  buyPack: (boosterPack: BoosterPack) => void;
  pickItemFromPack: (item: CardPosition | BoosterPosition) => void;
  selectedBooster: BoosterPosition | null;
  setSelectedBooster: (booster: BoosterPosition | null) => void;
  setSelectedBera: (bera: string | null) => void;
  boughtPacks: Record<BoosterPack, boolean>;
  sellBera: (bera: string) => void;
  sellBooster: (booster: string) => void;
}

export type CalculationOption = {
  breakdown?: boolean;
  isInHand?: boolean;
  isScored?: boolean;
  beraRetrigger?: boolean;
  cardRetrigger?: boolean;
};
