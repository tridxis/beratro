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
import { initCards, initBeras } from "@/utils/seeds";
import { BERA_STATS } from "@/utils/beraStats";

export const useGameStore = create<GameStore>()(
  persist(
    (set) => {
      const { gameBeras, deckBeras } = initBeras();
      return {
        gameBeras,
        playingBeras: [],
        deckBeras,
        shopBeras: [],
        handCards: [],
        deckCards: initCards(),
        selectedCards: [],
        playedHands: [],
        discards: [],
        removedCards: [],
        maxHands: DEFAULT_MAX_HANDS,
        maxDiscards: DEFAULT_MAX_DISCARDS,
        score: 0,
        gold: 0,
        currentState: GameState.BERAS_PICKING,

        endRound: (goldEarned: number) =>
          set((state) => {
            // Take top 3 beras from deck for shop
            const shopBeras = state.deckBeras.slice(0, 3);
            const remainingDeckBeras = state.deckBeras.slice(3);

            return {
              gold: state.gold + goldEarned,
              handCards: [],
              deckCards: initCards(),
              selectedCards: [],
              playedHands: [],
              discards: [],
              currentState: GameState.SHOPPING,
              shopBeras,
              deckBeras: remainingDeckBeras,
            };
          }),

        buyBera: (id: number) =>
          set((state) => {
            const bera = state.shopBeras.find((b) => b.id === id);
            if (!bera) return state;

            const cost = BERA_STATS[bera.bera].cost;
            if (state.gold < cost) return state;

            return {
              shopBeras: state.shopBeras.filter((b) => b.id !== id),
              playingBeras: [...state.playingBeras, bera],
              gold: state.gold - cost,
            };
          }),

        setCurrentState: (state: GameState) => set({ currentState: state }),
        reset: () => {
          const { gameBeras, deckBeras } = initBeras();
          set(() => ({
            handCards: [],
            playingBeras: [],
            deckCards: initCards(),
            deckBeras,
            gameBeras,
            selectedCards: [],
            playedHands: [],
            discards: [],
            score: 0,
            currentState: GameState.BERAS_PICKING,
          }));
        },

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

            const dealtCards = state.deckCards.slice(0, cardsToDeal);
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
        removeSelectedCards: () =>
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
              removedCards: [...state.removedCards, selectedHandCards],
            };
          }),
        setMaxHands: (value) => set({ maxHands: value }),
        setMaxDiscards: (value) => set({ maxDiscards: value }),
        addScore: (points: number) =>
          set((state) => ({
            score: state.score + points,
          })),
      };
    },
    {
      name: "card-storage",
    }
  )
);
