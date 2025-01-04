import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CardStore, CardPosition } from "@/types/cards";
import { SUIT_ORDER, CARD_RANKS } from "@/utils/constants";
import { initialCards } from "@/utils/seeds";

export const useCardStore = create<CardStore>()(
  persist(
    (set) => ({
      cards: initialCards,
      selectedCards: [] as number[],

      setCards: (cards: CardPosition[]) => set({ cards }),
      setSelectedCards: (selectedCards: number[]) => set({ selectedCards }),

      toggleSelectedCard: (id: number) =>
        set((state: CardStore) => ({
          selectedCards: state.selectedCards.includes(id)
            ? state.selectedCards.filter((cardId) => cardId !== id)
            : [...state.selectedCards, id],
        })),

      sortByValue: () =>
        set((state) => ({
          cards: [...state.cards].sort((a, b) => {
            return (CARD_RANKS[b.rank] || 0) - (CARD_RANKS[a.rank] || 0);
          }),
        })),

      sortBySuit: () =>
        set((state) => ({
          cards: [...state.cards].sort((a, b) => {
            const suitCompare =
              (SUIT_ORDER[a.suit] || 0) - (SUIT_ORDER[b.suit] || 0);
            if (suitCompare === 0) {
              return (CARD_RANKS[b.rank] || 0) - (CARD_RANKS[a.rank] || 0);
            }
            return suitCompare;
          }),
        })),

      reorderCards: (newOrder: number[]) =>
        set((state: CardStore) => ({
          cards: newOrder.map((id) => {
            const card = state.cards.find((card) => card.id === id);
            if (!card) throw new Error(`Card with id ${id} not found`);
            return card;
          }),
        })),
    }),
    {
      name: "card-storage",
    }
  )
);
