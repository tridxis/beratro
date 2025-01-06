import { CardPosition } from "./cards";

export interface GameStore {
  handCards: CardPosition[];
  deckCards: CardPosition[];
  selectedCards: number[];
  playedHands: CardPosition[][];
  discards: CardPosition[][];
  maxHands: number;
  maxDiscards: number;
  score: number;

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
}
