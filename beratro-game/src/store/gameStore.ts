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
  HandType,
} from "@/utils/constants";
import { initCards, initBeras } from "@/utils/seeds";
import { BERA_STATS } from "@/utils/beraStats";
import { shuffleCards } from "@/utils/cards";

const getRoundReqScore = (round: number) => {
  if (round <= 10) {
    // Calculate base exponential value, adjusted to start at 300
    const score = 220 * Math.exp(0.3 * round);

    // For rounds 8-10, round to nearest 500
    if (round >= 8) {
      return Math.round(score / 500) * 500;
    }
    // For rounds 5-7, round to nearest 250
    if (round >= 5) {
      return Math.round(score / 250) * 250;
    }
    // For earlier rounds, round to nearest 50
    return Math.round(score / 50) * 50;
  }

  // After round 10, round to nearest 1000
  const score = 5000 * Math.exp(0.3 * (round - 10));
  return Math.round(score / 1000) * 1000;
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
        roundGold: 4,
        reqScore: getRoundReqScore(1),
        boosters: [],
        currentState: GameState.BERAS_PICKING,
        lastHandType: null,
        endRound: (goldEarned: number) =>
          set((state) => {
            // Take top 3 beras from deck for shop
            const shopBeras = state.deckBeras.slice(0, 3);
            const remainingDeckBeras = state.deckBeras.slice(3);

            return {
              gold: state.gold + goldEarned,
              handCards: [],
              deckCards: shuffleCards([
                ...state.deckCards,
                ...state.handCards,
                ...state.playedHands.flat(),
                ...state.discards.flat(),
              ]),
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
        convertCards: (ids: number[], card: Partial<CardPosition>) =>
          set((state: GameStore) => ({
            handCards: state.handCards.map((c) =>
              ids.includes(c.id)
                ? { ...c, ...card, id: c.id, index: c.index }
                : c
            ),
          })),
        sortByValue: () =>
          set((state) => ({
            // maxHands: state.maxHands + 2,
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
        setLastHandType: (handType: HandType) =>
          set((state) => ({ lastHandType: handType })),
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
        removeCards: (cs?: CardPosition[]) =>
          set((state) => {
            const selectedCards = state.handCards.filter((card) =>
              state.selectedCards.includes(card.id)
            );
            const cards = !cs ? selectedCards : cs;

            if (cards.length === 0) return state;

            const remainingHandCards = state.handCards.filter(
              (card) => !cards.map((c) => c.id).includes(card.id)
            );

            return {
              handCards: remainingHandCards,
              selectedCards: [],
              removedCards: [...state.removedCards, cards],
            };
          }),
        addCardsToHand: (cards: CardPosition[]) =>
          set((state) => {
            return {
              handCards: [...state.handCards, ...cards],
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
            playedHands: state.playedHands.map((hand, index) =>
              index === state.playedHands.length - 1
                ? hand.map((card) => ({ ...card, ...value }))
                : hand
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
