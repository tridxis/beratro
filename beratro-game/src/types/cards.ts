import { CardRank, CardSuit } from "@/utils/constants";

export interface CardPosition {
  id: number;
  rank: CardRank;
  suit: CardSuit;
}

export interface CardStore {
  handCards: CardPosition[];
  deckCards: CardPosition[];
  selectedCards: number[];

  reset: () => void;
  setHandCards: (cards: CardPosition[]) => void;
  setDeckCards: (cards: CardPosition[]) => void;
  setSelectedCards: (selectedCards: number[]) => void;
  toggleSelectedCard: (id: number) => void;
  sortByValue: () => void;
  sortBySuit: () => void;
  reorderCards: (newOrder: number[]) => void;
  dealCards: (count?: number) => void;
}
