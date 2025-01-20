import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BoosterPosition, type CardPosition } from "@/types/cards";
import { GameState, type GameStore } from "@/types/games";
import {
  SUIT_ORDER,
  CARD_RANKS,
  DEFAULT_MAX_HANDS,
  DEFAULT_MAX_DISCARDS,
  Flower,
  Sticker,
  Meme,
  DEFAULT_MAX_BOOSTERS,
  DEFAULT_MAX_BERAS,
} from "@/utils/constants";
import { initCards, initBeras } from "@/utils/seeds";
import { BERA_STATS } from "@/utils/beraStats";
import { shuffleCards } from "@/utils/cards";

const getRoundReqScore = (round: number) => {
  // Using exponential growth: base * e^(k * round)
  // Solving for k using round 1 = 200 and round 20 = 1000000
  // 200 = base * e^k
  // 1000000 = base * e^(20k)
  // k ≈ 0.3
  // base ≈ 148
  return Math.round(148 * Math.exp(0.3 * round));
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => {
      const { gameBeras, deckBeras } = initBeras();
      return {
        gameBeras,
        deckBeras,
        playingBeras: [],
        shopBeras: [],
        handCards: [],
        deckCards: initCards(),
        selectedCards: [],
        playedHands: [],
        discards: [],
        removedCards: [],
        addedCards: [],
        maxHands: DEFAULT_MAX_HANDS,
        maxDiscards: DEFAULT_MAX_DISCARDS,
        maxBoosters: DEFAULT_MAX_BOOSTERS,
        maxBeras: DEFAULT_MAX_BERAS,
        usedFlowers: [],
        usedStickers: [],
        usedMemes: [],
        score: 0,
        gold: 0,
        round: 1,
        reqScore: getRoundReqScore(1),
        boosters: [],
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
            gameBeras,
            deckBeras,
            playingBeras: [],
            shopBeras: [],
            handCards: [],
            deckCards: initCards(),
            selectedCards: [],
            playedHands: [],
            discards: [],
            removedCards: [],
            addedCards: [],
            maxHands: DEFAULT_MAX_HANDS,
            maxDiscards: DEFAULT_MAX_DISCARDS,
            maxBoosters: DEFAULT_MAX_BOOSTERS,
            maxBeras: DEFAULT_MAX_BERAS,
            usedFlowers: [],
            usedStickers: [],
            usedMemes: [],
            score: 0,
            gold: 0,
            round: 1,
            reqScore: getRoundReqScore(1),
            boosters: [],
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
        addCardsToDeck: (cards: CardPosition[]) =>
          set((state) => {
            // Add cards to both deck and tracking array
            const newDeckCards = [...state.deckCards, ...cards];
            const shuffledDeckCards = shuffleCards(newDeckCards);
            return {
              deckCards: shuffledDeckCards,
              addedCards: [...state.addedCards, cards],
            };
          }),
        setMaxHands: (value) => set({ maxHands: value }),
        setMaxDiscards: (value) => set({ maxDiscards: value }),
        addScore: (points: number) =>
          set((state) => ({
            score: state.score + points,
          })),
        useBooster: (booster: BoosterPosition) =>
          set((state) => {
            if (booster.booster in Flower) {
              return {
                usedFlowers: [...state.usedFlowers, booster.booster as Flower],
                boosters: state.boosters.filter((b) => b.id !== booster.id),
              };
            }
            if (booster.booster in Sticker) {
              return {
                usedStickers: [
                  ...state.usedStickers,
                  booster.booster as Sticker,
                ],
                boosters: state.boosters.filter((b) => b.id !== booster.id),
              };
            }
            if (booster.booster in Meme) {
              return {
                usedMemes: [...state.usedMemes, booster.booster as Meme],
                boosters: state.boosters.filter((b) => b.id !== booster.id),
              };
            }
            return state;
          }),
        modifyGold: (value: number) =>
          set((state) => ({
            gold: state.gold + value,
          })),
        addBooster: (booster: Flower | Sticker | Meme) =>
          set((state) => {
            const nextIndex = state.boosters.length;
            if (nextIndex >= state.maxBoosters) return state;
            return {
              boosters: [
                ...state.boosters,
                {
                  id: nextIndex,
                  index: nextIndex,
                  booster,
                },
              ],
            };
          }),
        modifyCards: (value: { chips?: number; mult?: number }) =>
          set((state) => ({
            handCards: state.handCards.map((card) =>
              state.selectedCards.includes(card.id)
                ? { ...card, ...value }
                : card
            ),
          })),
        nextRound: () => {
          set((state) => {
            return {
              score: 0,
              round: state.round + 1,
              reqScore: getRoundReqScore(state.round + 1),
              currentState: GameState.PLAYING,
              playedHands: [],
              discards: [],
              deckCards: shuffleCards([
                ...state.deckCards,
                ...state.handCards,
                ...state.discards.flat(),
                ...state.playedHands.flat(),
              ]),
            };
          });
        },
      };
    },
    {
      name: "card-storage",
    }
  )
);
