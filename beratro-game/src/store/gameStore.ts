/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  DEFAULT_REROLL_COST,
  Bera,
} from "@/utils/constants";
import { initCards, initBeras } from "@/utils/seeds";
import { BERA_STATS, BeraType } from "@/utils/beraStats";
import { shuffleCards } from "@/utils/cards";
import { STICKER_STATS, StickerRarity } from "@/utils/stickerStats";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { MEME_STATS } from "@/utils/memeStats";
import { v4 as uuidv4 } from "uuid";
import { BeraPosition } from "@/types/beras";

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

const generateRandomBeras = (count: number): BeraPosition[] => {
  const beras = Object.values(Bera);
  return Array.from({ length: count }, () => ({
    id: uuidv4(),
    bera: beras[Math.floor(Math.random() * beras.length)],
    index: 0,
    level: 1,
  })).map((bera, index) => ({ ...bera, index }));
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      const { gameBeras } = initBeras();
      return {
        gameBeras,
        playingBeras: [],
        shopBeras: [],
        handCards: [],
        deckCards: initCards(),
        selectedCards: [],
        playedHands: [],
        allPlayedHands: [],
        discards: [],
        removedCards: [],
        addedCards: [],
        maxHands: DEFAULT_MAX_HANDS,
        maxDiscards: DEFAULT_MAX_DISCARDS,
        maxBoosters: DEFAULT_MAX_BOOSTERS,
        maxBeras: DEFAULT_MAX_BERAS,
        rerollCost: DEFAULT_REROLL_COST,
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
        selectedBeras: [],
        boughtPacks: {
          [BoosterPack.BASIC]: false,
          [BoosterPack.PREMIUM]: false,
          [BoosterPack.ULTRA]: false,
        },

        endRound: (goldEarned: number) =>
          set((state) => {
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
              shopBeras: generateRandomBeras(3),
              rerollCost: DEFAULT_REROLL_COST,
            };
          }),

        buyBera: (id: string) =>
          set((state) => {
            if (state.playingBeras.length >= state.maxBeras) return state;
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
          const { gameBeras } = initBeras();
          set(() => ({
            gameBeras,
            playingBeras: [],
            shopBeras: [],
            handCards: [],
            deckCards: initCards(),
            selectedCards: [],
            playedHands: [],
            allPlayedHands: [],
            discards: [],
            removedCards: [],
            addedCards: [],
            maxHands: DEFAULT_MAX_HANDS,
            maxDiscards: DEFAULT_MAX_DISCARDS,
            maxBoosters: DEFAULT_MAX_BOOSTERS,
            maxBeras: DEFAULT_MAX_BERAS,
            rerollCost: DEFAULT_REROLL_COST,
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
            handLevels: {},
            selectedBeras: [],
            boughtPacks: {
              [BoosterPack.BASIC]: false,
              [BoosterPack.PREMIUM]: false,
              [BoosterPack.ULTRA]: false,
            },
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
                    BERA_STATS[bera.bera].values[bera.level - 1],
                    [],
                    state
                  ),
                0
              )
          );
        },

        setHandCards: (handCards: CardPosition[]) => set({ handCards }),
        setDeckCards: (deckCards: CardPosition[]) => set({ deckCards }),
        setSelectedCards: (selectedCards: string[]) => set({ selectedCards }),

        toggleSelectedCard: (id: string) =>
          set((state) => {
            const newSelectedCards = state.selectedCards.includes(id)
              ? state.selectedCards.filter((cardId) => cardId !== id)
              : [...state.selectedCards, id];

            // Sort selected cards by their index in handCards
            const sortedSelectedCards = newSelectedCards
              .map((cardId) => ({
                id: cardId,
                index:
                  state.handCards.find((card) => card.id === cardId)?.index ??
                  0,
              }))
              .sort((a, b) => a.index - b.index)
              .map((card) => card.id);

            return { selectedCards: sortedSelectedCards };
          }),
        convertCards: (ids: string[], card: Partial<CardPosition>) =>
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

        reorderCards: (newOrder: string[]) =>
          set((state) => ({
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
            console.log("state.deckCards", state.deckCards);
            const cardsToDeal = count ?? availableSpace;

            const dealtCards = state.deckCards.slice(0, cardsToDeal);
            const remainingDeck = state.deckCards.slice(cardsToDeal);

            console.log("dealtCards", dealtCards);
            console.log("remainingDeck", remainingDeck);

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
              allPlayedHands: [...state.allPlayedHands, selectedHandCards],
            };
          }),
        setLastHandType: (handType: HandType) =>
          set(() => ({ lastHandType: handType })),
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
              const updated = { ...state };
              if (sticker.kind === "bera") {
                const bera = state.playingBeras.find(
                  (b) => b.id === state.selectedBeras[0]
                );
                if (bera == null) return state;
                bera.sticker = booster.booster as Sticker;
                updated.playingBeras = state.playingBeras;
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
            state.selectedCards = [];
            state.selectedBeras = [];
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
                  id: uuidv4(),
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
            handCards: [],
            playedHands: [],
            discards: [],
            rerollCost: DEFAULT_REROLL_COST,
            boughtPacks: {
              [BoosterPack.BASIC]: false,
              [BoosterPack.PREMIUM]: false,
              [BoosterPack.ULTRA]: false,
            },
            deckCards: shuffleCards([
              ...state.deckCards,
              ...state.handCards,
              ...state.discards.flat(),
              ...state.playedHands.flat(),
            ]) as CardPosition[],
          }));
        },
        buyPack: (boosterPack: BoosterPack) => {
          const state = get();
          const { price, items } = BOOSTER_PACK_INFO[boosterPack];

          // Check if already bought this pack type
          if (state.boughtPacks[boosterPack]) {
            return;
          }

          if (state.gold < price) return;

          // Generate available items to pick from
          const cards = shuffleCards(initCards()).map((card) => ({
            ...card,
            id: uuidv4(), // Generate UUID for each card
            index: card.index,
          }));

          const stickers = Object.entries(STICKER_STATS)
            .map(([key, stat]) => {
              if (stat.rarity === StickerRarity.UNCOMMON) {
                return Array(2).fill(key);
              } else if (stat.rarity === StickerRarity.RARE) {
                return Array(1).fill(key);
              }
              return Array(4).fill(key);
            })
            .flat()
            .map(
              (sticker: string, index) =>
                ({
                  id: uuidv4(), // Only id uses UUID
                  index: index + cards.length + 1, // Keep numeric index
                  booster: sticker,
                  boosterType: "sticker",
                } as BoosterPosition)
            );

          const flowers = Object.values(Flower)
            .map((flower) => Array(4).fill(flower))
            .flat()
            .map(
              (flower: string, index) =>
                ({
                  id: uuidv4(), // Only id uses UUID
                  index: index + cards.length + stickers.length + 1, // Keep numeric index
                  booster: flower,
                  boosterType: "flower",
                } as BoosterPosition)
            );

          const memes = Object.values(Meme)
            .map((meme) => Array(4).fill(meme))
            .flat()
            .map(
              (meme: string, index) =>
                ({
                  id: uuidv4(), // Only id uses UUID
                  index:
                    index + cards.length + stickers.length + flowers.length + 1, // Keep numeric index
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
            boughtPacks: {
              ...state.boughtPacks,
              [boosterPack]: true,
            },
            selectedPack: { boosterPack, items: packItems, pickedItems: [] },
          }));
        },
        pickItemFromPack: (item: CardPosition | BoosterPosition) =>
          set((state) => {
            if (!state.selectedPack) return state;

            // Check if item was already picked
            if (state.selectedPack.pickedItems?.includes(item.id)) return state;

            const pickedItems = [
              ...(state.selectedPack.pickedItems || []),
              item.id,
            ];

            const updated: Partial<GameStore> = {};

            if (!("booster" in item)) {
              const newCard: CardPosition = {
                ...item,
                index: state.deckCards.length,
                id: uuidv4(), // Generate new UUID when adding to deck
              };
              updated.deckCards = shuffleCards([
                ...state.deckCards,
                newCard,
              ]) as CardPosition[];
              updated.addedCards = [...state.addedCards, [newCard]];
            } else {
              if (state.boosters.length >= state.maxBoosters) return state;
              updated.boosters = [...state.boosters, item];
            }

            return {
              ...updated,
              selectedPack:
                pickedItems.length <
                BOOSTER_PACK_INFO[state.selectedPack.boosterPack].pick
                  ? { ...state.selectedPack, pickedItems }
                  : null, // Clear selected pack after picking
            };
          }),
        setSelectedBooster: (booster: BoosterPosition | null) =>
          set({ selectedBooster: booster }),
        setSelectedBeras: (beraIds: string[]) =>
          set({ selectedBeras: beraIds }),
        sellBera: (id: string) =>
          set((state) => {
            const bera = state.playingBeras.find((b) => b.id === id);
            if (!bera) return state;

            // Get half the original cost back (rounded down)
            const refund = Math.floor(BERA_STATS[bera.bera].cost / 2);

            return {
              playingBeras: state.playingBeras.filter((b) => b.id !== id),
              gold: state.gold + refund,
              selectedBeras: state.selectedBeras.filter((b) => b !== id),
            };
          }),
        sellBooster: (id: string) =>
          set((state) => {
            const booster = state.boosters.find((b) => b.id === id);
            if (!booster) return state;

            // Fixed price of $2 for selling boosters
            const refund = 2;

            return {
              boosters: state.boosters.filter((b) => b.id !== id),
              gold: state.gold + refund,
              selectedBooster: null, // Clear selection after selling
            };
          }),
        skipPack: () =>
          set((state) => {
            if (!state.selectedPack) return state;
            return {
              selectedPack: null, // Clear selected pack
            };
          }),
        reorderBeras: (newOrder: BeraPosition[]) =>
          set(() => ({
            playingBeras: newOrder.map((bera, index) => ({
              ...bera,
              index,
            })),
          })),

        mergeBeras: (sourceId, targetId) =>
          set((state) => {
            const source = state.playingBeras.find((b) => b.id === sourceId);
            const target = state.playingBeras.find((b) => b.id === targetId);

            if (
              !source ||
              !target ||
              source.bera !== target.bera ||
              source.level !== target.level
            ) {
              return state;
            }

            const newLevel = source.level + 1;
            if (newLevel > 3) return state;

            return {
              playingBeras: state.playingBeras
                .filter((b) => b.id !== sourceId)
                .map((b) => (b.id === targetId ? { ...b, level: newLevel } : b))
                .map((bera, index) => ({ ...bera, index })),
            };
          }),
        rerollShopBeras: () =>
          set((state) => {
            if (state.gold < state.rerollCost) return state;

            return {
              shopBeras: generateRandomBeras(3),
              gold: state.gold - state.rerollCost,
              rerollCost: state.rerollCost + 1,
            };
          }),
      };
    },
    {
      name: "card-storage",
    }
  )
);
