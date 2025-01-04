import { CardRank, CardSuit } from "@/utils/constants";

export interface CardPosition {
  id: number;
  rank: CardRank;
  suit: CardSuit;
}

export interface CardStore {
  cards: CardPosition[];
  selectedCards: number[];
  setCards: (cards: CardPosition[]) => void;
  setSelectedCards: (selectedCards: number[]) => void;
  toggleSelectedCard: (id: number) => void;
  sortByValue: () => void;
  sortBySuit: () => void;
  reorderCards: (newOrder: number[]) => void;
}
