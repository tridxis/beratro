import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CardPosition } from "@/types/cards";
import { GameState, type GameStore } from "@/types/games";
import {
  SUIT_ORDER,
  CARD_RANKS,
  DEFAULT_MAX_HANDS,
  DEFAULT_MAX_DISCARDS,
} from "@/utils/constants";
import { initCards } from "@/utils/seeds";

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      handCards: [],
      deckCards: initCards(),
      selectedCards: [] as number[],
      playedHands: [] as CardPosition[][],
      discards: [] as CardPosition[][],
      maxHands: DEFAULT_MAX_HANDS,
      maxDiscards: DEFAULT_MAX_DISCARDS,
      score: 0,
      currentState: GameState.BERAS_PICKING,
      setCurrentState: (state: GameState) => set({ currentState: state }),
      reset: () =>
        set(() => ({
          handCards: [],
          deckCards: initCards(),
          selectedCards: [],
          playedHands: [],
          discards: [],
          score: 0,
          currentState: GameState.BERAS_PICKING,
        })),

      setHandCards: (handCards: CardPosition[]) => set({ handCards }),
      setDeckCards: (deckCards: CardPosition[]) => set({ deckCards }),
      setSelectedCards: (selectedCards: number[]) => set({ selectedCards }),

      toggleSelectedCard: (id: number) =>
        set((state: GameStore) => ({
          selectedCards: state.selectedCards.includes(id)
            ? state.selectedCards.filter((cardId) => cardId !== id)
            : [...state.selectedCards, id],
        })),

      sortByValue: () =>
        set((state) => ({
          handCards: [...state.handCards]
            .sort((a, b) => {
              return (CARD_RANKS[b.rank] || 0) - (CARD_RANKS[a.rank] || 0);
            })
            .map((card, index) => ({
              ...card,
              index: index,
            })),
        })),

      sortBySuit: () =>
        set((state) => ({
          handCards: [...state.handCards]
            .sort((a, b) => {
              const suitCompare =
                (SUIT_ORDER[a.suit] || 0) - (SUIT_ORDER[b.suit] || 0);
              if (suitCompare === 0) {
                return (CARD_RANKS[b.rank] || 0) - (CARD_RANKS[a.rank] || 0);
              }
              return suitCompare;
            })
            .map((card, index) => ({
              ...card,
              index: index,
            })),
        })),

      reorderCards: (newOrder: number[]) =>
        set((state: GameStore) => ({
          handCards: state.handCards.map((card) => ({
            ...card,
            index: newOrder.indexOf(card.id),
          })),
        })),

      dealCards: (count?: number) =>
        set((state) => {
          const availableSpace = 8 - state.handCards.length;
          const cardsToDeal = count ?? availableSpace;

          const dealtCards = state.deckCards
            .slice(0, cardsToDeal)
            .map((card, index) => ({
              ...card,
              index: index + state.handCards.length,
            }));
          const remainingDeck = state.deckCards.slice(cardsToDeal);

          return {
            handCards: [...state.handCards, ...dealtCards],
            deckCards: remainingDeck,
          };
        }),

      playSelectedCards: () =>
        set((state) => {
          const selectedHandCards = state.handCards.filter((card) =>
            state.selectedCards.includes(card.id)
          );

          if (selectedHandCards.length === 0) return state;

          const remainingHandCards = state.handCards.filter(
            (card) => !state.selectedCards.includes(card.id)
          );

          return {
            handCards: remainingHandCards,
            selectedCards: [],
            playedHands: [...state.playedHands, selectedHandCards],
          };
        }),

      discardSelectedCards: () =>
        set((state) => {
          const selectedHandCards = state.handCards.filter((card) =>
            state.selectedCards.includes(card.id)
          );

          if (selectedHandCards.length === 0) return state;

          const remainingHandCards = state.handCards.filter(
            (card) => !state.selectedCards.includes(card.id)
          );

          return {
            handCards: remainingHandCards,
            selectedCards: [],
            discards: [...state.discards, selectedHandCards],
          };
        }),
      setMaxHands: (value) => set({ maxHands: value }),
      setMaxDiscards: (value) => set({ maxDiscards: value }),
      addScore: (points: number) =>
        set((state) => ({
          score: state.score + points,
        })),
    }),
    {
      name: "card-storage",
    }
  )
);
