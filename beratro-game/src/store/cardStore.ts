import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CardStore, CardPosition } from "@/types/cards";
import { SUIT_ORDER, CARD_RANKS } from "@/utils/constants";
import { initialCards } from "@/utils/seeds";

export const useCardStore = create<CardStore>()(
  persist(
    (set) => ({
      handCards: [],
      deckCards: initialCards,
      selectedCards: [] as number[],

      reset: () =>
        set(() => ({
          handCards: [],
          deckCards: initialCards,
          selectedCards: [],
        })),

      setHandCards: (handCards: CardPosition[]) => set({ handCards }),
      setDeckCards: (deckCards: CardPosition[]) => set({ deckCards }),
      setSelectedCards: (selectedCards: number[]) => set({ selectedCards }),

      toggleSelectedCard: (id: number) =>
        set((state: CardStore) => ({
          selectedCards: state.selectedCards.includes(id)
            ? state.selectedCards.filter((cardId) => cardId !== id)
            : [...state.selectedCards, id],
        })),

      sortByValue: () =>
        set((state) => ({
          handCards: [...state.handCards].sort((a, b) => {
            return (CARD_RANKS[b.rank] || 0) - (CARD_RANKS[a.rank] || 0);
          }),
        })),

      sortBySuit: () =>
        set((state) => ({
          handCards: [...state.handCards].sort((a, b) => {
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
          handCards: newOrder.map((id) => {
            const card = state.handCards.find((card) => card.id === id);
            if (!card) throw new Error(`Card with id ${id} not found`);
            return card;
          }),
        })),

      dealCards: (count?: number) =>
        set((state) => {
          const availableSpace = 8 - state.handCards.length;
          const cardsToDeal = count ?? availableSpace;

          const dealtCards = state.deckCards.slice(0, cardsToDeal);
          const remainingDeck = state.deckCards.slice(cardsToDeal);

          return {
            handCards: [...state.handCards, ...dealtCards],
            deckCards: remainingDeck,
          };
        }),
    }),
    {
      name: "card-storage",
    }
  )
);
