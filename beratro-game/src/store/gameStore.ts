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
  BoosterPack,
  BOOSTER_PACK_INFO,
} from "@/utils/constants";
import { initCards, initBeras } from "@/utils/seeds";
import { BERA_STATS, BeraType } from "@/utils/beraStats";
import { shuffleCards } from "@/utils/cards";
import { STICKER_STATS, StickerRarity } from "@/utils/stickerStats";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { MEME_STATS } from "@/utils/memeStats";

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
    (set, get) => {
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
        selectedPack: null,
        selectedBooster: null,
        handLevels: {},
        selectedBera: null,

        endRound: (goldEarned: number) =>
          set((state) => {
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
              ]) as CardPosition[],
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
            lastHandType: null,
            selectedPack: null,
            selectedBooster: null,
          }));
        },

        getHandSize: () => {
          const state = get();
          return (
            8 +
            state.playingBeras
              .filter(
                (bera) =>
                  BERA_STATS[bera.bera].type === BeraType.INCREASE_HAND_SIZE
              )
              .reduce(
                (acc, bera) =>
                  acc +
                  BERA_STATS[bera.bera].trigger(
                    BERA_STATS[bera.bera].values[0],
                    [],
                    state
                  ),
                0
              )
          );
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
            handCards: state.handCards
              .map((card) => ({
                ...card,
                index: newOrder.indexOf(card.id),
              }))
              .sort((a, b) => a.index - b.index),
          })),

        dealCards: (count?: number) =>
          set((state) => {
            const availableSpace = state.getHandSize() - state.handCards.length;
            console.log("availableSpace", availableSpace);
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
            const newDeckCards = [...state.deckCards, ...cards];
            const shuffledDeckCards = shuffleCards(
              newDeckCards
            ) as CardPosition[];
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
        activateBooster: (booster: BoosterPosition) =>
          set((state) => {
            if (booster.boosterType === "flower") {
              const hand = FLOWER_STATS[booster.booster as Flower].hand;
              return {
                usedFlowers: [...state.usedFlowers, booster.booster as Flower],
                boosters: state.boosters.filter((b) => b.id !== booster.id),
                handLevels: {
                  ...state.handLevels,
                  [hand]: (state.handLevels[hand] || 1) + 1,
                },
              };
            }
            if (booster.boosterType === "sticker") {
              const sticker = STICKER_STATS[booster.booster as Sticker];
              const updated: GameStore = {};
              if (sticker.kind === "bera") {
                const bera = state.playingBeras.find(
                  (b) => b.id === state.selectedBera
                );
                if (bera == null) return state;
                bera.sticker = booster.booster as Sticker;
                updated.playingBeras = state.playingBeras;
                // update sticker to bera card
              } else {
                if (state.selectedCards.length !== 1) return state;
                const card = state.handCards.find(
                  (c) => c.id === state.selectedCards[0]
                );
                if (card == null) return state;
                if (sticker.kind === "animal") {
                  card.animalSticker = booster.booster as Sticker;
                } else {
                  card.fruitSticker = booster.booster as Sticker;
                }
                updated.handCards = state.handCards;
              }

              // find the card that is selected then update its
              return {
                ...updated,
                usedStickers: [
                  ...state.usedStickers,
                  booster.booster as Sticker,
                ],
                boosters: state.boosters.filter((b) => b.id !== booster.id),
              };
            }
            if (booster.boosterType === "meme") {
              const meme = MEME_STATS[booster.booster as Meme];
              meme.trigger(state);
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
        addBooster: (
          booster: Flower | Sticker | Meme,
          boosterType: "flower" | "sticker" | "meme"
        ) =>
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
                  boosterType,
                } as BoosterPosition,
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
          set((state) => ({
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
            ]) as CardPosition[],
          }));
        },
        buyPack: (boosterPack: BoosterPack) => {
          const { price, items } = BOOSTER_PACK_INFO[boosterPack];
          const { gold } = get();
          if (gold < price) return;

          // Generate available items to pick from
          const cards = shuffleCards(initCards()); // All 52 standard cards
          const stickers = Object.entries(STICKER_STATS)
            .map(([key, stat]) => {
              if (stat.rarity === StickerRarity.UNCOMMON) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return Array(2).fill(key);
              } else if (stat.rarity === StickerRarity.RARE) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return Array(1).fill(key);
              }
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return Array(4).fill(key);
            })
            .flat()
            .map(
              (sticker: string, index) =>
                ({
                  id: index + cards.length + 1,
                  index: index + cards.length + 1,
                  booster: sticker,
                  boosterType: "sticker",
                } as BoosterPosition)
            );
          const flowers = Object.values(Flower)
            .map((flower) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return Array(4).fill(flower);
            })
            .flat()
            .map(
              (flower: string, index) =>
                ({
                  id: index + cards.length + stickers.length + 1,
                  index: index + cards.length + stickers.length + 1,
                  booster: flower,
                  boosterType: "flower",
                } as BoosterPosition)
            );
          const memes = Object.values(Meme)
            .map((meme) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return Array(4).fill(meme);
            })
            .flat()
            .map(
              (meme: string, index) =>
                ({
                  id:
                    index + cards.length + stickers.length + flowers.length + 1,
                  index:
                    index + cards.length + stickers.length + flowers.length + 1,
                  booster: meme,
                  boosterType: "meme",
                } as BoosterPosition)
            );

          // Combine all items and shuffle
          const allItems = shuffleCards([
            ...cards,
            ...stickers,
            ...flowers,
            ...memes,
          ]);

          // Take first 5 items to show
          const packItems = allItems.slice(0, items);

          set((state) => ({
            gold: state.gold - price,
            selectedPack: { boosterPack, items: packItems, picked: 0 },
          }));
        },
        pickItemFromPack: (item: CardPosition | BoosterPosition) =>
          set((state) => {
            if (!state.selectedPack) return state;

            const picked = state.selectedPack.picked + 1;

            const updated: GameStore = {};

            // check if item is card (not having booster) add to deck

            if (!("booster" in item)) {
              updated.deckCards = shuffleCards([
                ...state.deckCards,
                {
                  ...item,
                  index: state.deckCards.length,
                  id: state.deckCards.length,
                },
              ]) as CardPosition[];
            } else {
              updated.boosters = [...state.boosters, item];
            }

            return {
              ...updated,
              selectedPack:
                picked < BOOSTER_PACK_INFO[state.selectedPack.boosterPack].pick
                  ? { ...state.selectedPack, picked }
                  : null, // Clear selected pack after picking
            };
          }),
        setSelectedBooster: (booster: BoosterPosition | null) =>
          set({ selectedBooster: booster }),
        setSelectedBera: (bera: number | null) => set({ selectedBera: bera }),
      };
    },
    {
      name: "card-storage",
    }
  )
);
