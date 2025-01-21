import { Bera, CARD_RANKS, CardRank, CardSuit } from "./constants";
import { CardPosition } from "@/types/cards";
import { countRanks, getRankCounts, isFlush, isStraight } from "./atomic";
import { GameStore } from "@/types/games";
import { isFaceCard } from "./cards";

export enum BeraType {
  ADD_CHIPS = "ADD_CHIPS",
  ADD_MULT = "ADD_MULT",
  ADD_GOLD = "ADD_GOLD",
  MUL_MULT = "MUL_MULT",
  GEN_FLOWER = "GEN_FLOWER",
  GEN_MEME = "GEN_MEME",
  GEN_STICKER = "GEN_STICKER",
  RETRIGGER = "RETRIGGER",
  INCREASE_CHIPS = "INCREASE_CHIPS",
  INCREASE_MULT = "INCREASE_MULT",
  REMOVE_CARDS = "REMOVE_CARDS",
}

export enum BeraAction {
  INDEP = "INDEP",
  ON_HELD = "ON_HELD",
  ON_PLAYED = "ON_PLAYED",
  ON_DISCARD = "ON_DISCARD",
  ON_SCORED = "ON_SCORED",
  ON_REMOVED = "ON_REMOVED",
  ON_ADDED = "ON_ADDED",
  ON_ENDED = "ON_ENDED",
}

export enum BeraRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export const BERA_STATS: Record<Bera, BeraStats> = {
  [Bera.BABY]: {
    name: "Baby",
    description: "+4 Mult",
    cost: 2,
    rarity: BeraRarity.COMMON,
    values: [4, 8, 16],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number) => {
      return value;
    },
  },
  [Bera.HEART]: {
    name: "Heart",
    description: "Played cards with Heart suit give {{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards[0].suit === CardSuit.HEARTS ? value : 0;
    },
  },
  [Bera.DIAMOND]: {
    name: "Diamond",
    description:
      "Played cards with Diamond suit give {{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards[0].suit === CardSuit.DIAMONDS ? value : 0;
    },
  },
  [Bera.CLUB]: {
    name: "Club",
    description: "Played cards with Club suit give +{{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards[0].suit === CardSuit.CLUBS ? value : 0;
    },
  },
  [Bera.SPADE]: {
    name: "Spade",
    description:
      "Played cards with Spade suit give +{{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 4, 5],
    type: BeraType.ADD_MULT,
    action: BeraAction.ON_SCORED,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards[0].suit === CardSuit.SPADES ? value : 0;
    },
  },
  [Bera.TWINS]: {
    name: "Twins",
    description: "+{{value}} Chips if played hand contains a Pair",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [50, 75, 100],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return countRanks(cards).includes(2) ? value : 0;
    },
  },
  [Bera.TRIPLETS]: {
    name: "Triplets",
    description: "+{{value}} Chips if played hand contains a Three of a Kind",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [100, 150, 200],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return countRanks(cards).includes(3) ? value : 0;
    },
  },
  [Bera.CLIMB]: {
    name: "Climb",
    description: "+{{value}} Chips if played hand contains a Straight",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [100, 150, 200],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return isStraight(cards).isValid ? value : 0;
    },
  },
  [Bera.UNIFORM]: {
    name: "Uniform",
    description: "+{{value}} Chips if played hand contains a Flush",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [80, 120, 160],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return isFlush(cards).isValid ? value : 0;
    },
  },
  [Bera.DOUBLES]: {
    name: "Doubles",
    description: "+{{value}} Mult if played hand contains a Pair",
    cost: 3,
    rarity: BeraRarity.COMMON,
    values: [8, 12, 16],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return countRanks(cards).includes(2) ? value : 0;
    },
  },
  [Bera.FAMILY]: {
    name: "Family",
    description: "+{{value}} Mult if played hand contains a Three of a Kind",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [12, 16, 20],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return countRanks(cards).includes(3) ? value : 0;
    },
  },
  [Bera.BUILDER]: {
    name: "Builder",
    description: "+{{value}} Mult if played hand contains a Four of a Straight",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [12, 16, 20],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return isStraight(cards).isValid ? value : 0;
    },
  },
  [Bera.COLORLESS]: {
    name: "Colorless",
    description: "+{{value}} Mult if played hand contains a Flush",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [10, 15, 20],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return isFlush(cards).isValid ? value : 0;
    },
  },
  [Bera.PERFECTION]: {
    name: "Perfection",
    description:
      "Each played 10 gives +{{value}} Chips when scored if only 10 played",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [100, 150, 200],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.ON_SCORED,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards.every((card) => card.rank === CardRank.TEN) ? value : 0;
    },
  },
  [Bera.MUSKETEERS]: {
    name: "Musketeers",
    description:
      "x{{value}} Mult if played hand contains a Three of a Kind of J",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [3, 4, 5],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      const rankCounts = getRankCounts(cards);
      return rankCounts[CARD_RANKS[CardRank.JACK]] >= 3 ? value : 0;
    },
  },
  [Bera.MOTHER_CARE]: {
    name: "Mother Care",
    description:
      " 1 in {{value}} chance for each played Q to create a Flower card when scored",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [3, 2, 1],
    type: BeraType.GEN_FLOWER,
    action: BeraAction.ON_SCORED,
    trigger: (value: number, cards: CardPosition[]) => {
      if (cards[0].rank === CardRank.QUEEN) {
        // TODO: random flower
        return Math.random() < 1 / value ? 1 : 0;
      }
      return 0;
    },
  },
  [Bera.CROWN]: {
    name: "Crown",
    description: "Each King held in hand gives x{{value}} Mult",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [1.5, 2, 2.5],
    type: BeraType.MUL_MULT,
    action: BeraAction.ON_HELD,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards[0].rank === CardRank.KING ? value : 0;
    },
  },
  [Bera.AIRDROP]: {
    name: "Airdrop",
    description: "Gains x{{value}} Mult for every A that is removed",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [1, 1.5, 2],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[], state: GameStore) => {
      const removedAces = state.removedCards
        .flat()
        .filter((card) => card.rank === CardRank.ACE);
      return removedAces.length > 0 ? value * removedAces.length : 0;
    },
  },
  [Bera.CHIP]: {
    name: "Chip",
    description: "+{{value}} Mult if played hand contains 3 or fewer cards",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [20, 30, 40],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards.length <= 3 ? value : 0;
    },
  },
  [Bera.CRAWL]: {
    name: "Crawl",
    description: "x{{value}} Mult if played hand contains 4 cards",
    cost: 5,
    rarity: BeraRarity.UNCOMMON,
    values: [2, 3, 4],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards.length === 4 ? value : 0;
    },
  },
  [Bera.FISH]: {
    name: "Fish",
    description: "Each A card held in hand will get ${{value}}",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_HELD,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards[0].rank === CardRank.ACE ? value : 0;
    },
  },
  [Bera.BAG]: {
    name: "Bag",
    description: "+{{value}} hand size",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [2, 3, 5],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_HELD,
    trigger: (value: number) => {
      return value;
    },
  },
  [Bera.SCARF]: {
    name: "Scarf",
    description: "+{{value}} Chips for each remaining discard",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [30, 40, 50],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[], state: GameStore) => {
      return state.maxDiscards - state.discards.length > 0
        ? value * (state.maxDiscards - state.discards.length)
        : 0;
    },
  },
  [Bera.HAT]: {
    name: "Hat",
    description:
      "Each card held in hand has a 1 in {{value}} chance to give $1",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [3, 2, 1],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_HELD,
    trigger: (value: number) => {
      return Math.random() < 1 / value ? value : 0;
    },
  },
  [Bera.LUSCIOUS]: {
    name: "Luscious",
    description: "Gains x{{value}} Mult every time a Flower is used",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [0.1, 0.2, 0.3],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[], state: GameStore) => {
      const times = state.usedFlowers.length;
      return times > 0 ? 1 + value * times : 1;
    },
  },
  [Bera.BADGE]: {
    name: "Badge",
    description: "Gains +{{value}} Chips for each card is added to the deck",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [50, 75, 100],
    type: BeraType.ADD_CHIPS,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[], state: GameStore) => {
      return state.addedCards.length > 0
        ? value * state.addedCards.flat().length
        : 0;
    },
  },
  [Bera.SHY]: {
    name: "Shy",
    description: "+{{value}} Mult if played hand contains no face card",
    cost: 3,
    rarity: BeraRarity.UNCOMMON,
    values: [20, 30, 40],
    type: BeraType.ADD_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards.every((card) => !isFaceCard(card)) ? value : 0;
    },
  },
  [Bera.NOPE]: {
    name: "Nope",
    description: "+{{value}} Mult for each discarded cards this round",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [2, 3, 4],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[], state: GameStore) => {
      return state.discards.length > 0
        ? value * state.discards.flat().length
        : 0;
    },
  },
  [Bera.BIG_TINY]: {
    name: "Big Tiny",
    description: "Retrigger {{value}} times all scored cards less than 10",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.RETRIGGER,
    action: BeraAction.ON_SCORED,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards[0].rank < CardRank.TEN ? value : 0;
    },
  },
  [Bera.GIFT]: {
    name: "Gift",
    description: "Earn ${{value}} at end of round",
    cost: 6,
    rarity: BeraRarity.COMMON,
    values: [4, 8, 12],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_ENDED,
    trigger: (value: number) => value,
  },
  [Bera.MAGNET]: {
    name: "Magnet",
    description:
      "{{value}} in 3 chance create a sticker if played hand contains a Flush",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.GEN_STICKER,
    action: BeraAction.ON_PLAYED,
    trigger: (value: number, cards: CardPosition[]) => {
      // TODO: random sticker
      return isFlush(cards).isValid && Math.random() < 1 / value ? 1 : 0;
    },
  },
  [Bera.BAKER]: {
    name: "Baker",
    description: "Create a ${{value}} if played hand contains a Straight",
    cost: 5,
    rarity: BeraRarity.UNCOMMON,
    values: [5, 10, 15],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_PLAYED,
    trigger: (value: number, cards: CardPosition[]) => {
      return isStraight(cards).isValid ? value : 0;
    },
  },
  [Bera.SMILE]: {
    name: "Smile",
    description: "Retrigger all card held in hand abilities {{value}} times",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.RETRIGGER,
    action: BeraAction.ON_HELD,
    trigger: (value: number) => {
      return value;
    },
  },
  [Bera.STAR]: {
    name: "Star",
    description: "Gains x{{value}} Mult for each star of playing Beras",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [0.25, 0.5, 0.75],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[], state: GameStore) => {
      return state.playingBeras.length > 0
        ? 1 +
            value *
              state.playingBeras.reduce((acc, bera) => acc + bera.level, 0)
        : 1;
    },
  },
  [Bera.DROOL]: {
    name: "Drool",
    description: "First played face card gives x{{value}} Mult when scored",
    cost: 5,
    rarity: BeraRarity.COMMON,
    values: [2, 3, 4],
    type: BeraType.MUL_MULT,
    action: BeraAction.ON_PLAYED,
    trigger: (value: number, cards: CardPosition[]) => {
      return isFaceCard(cards[0]) ? value : 0;
    },
  },
  [Bera.SLEEP]: {
    name: "Sleep",
    description:
      "If discard less than or equal to {{value}} card/cards below Rank 10, remove it/them from the game",
    cost: 8,
    rarity: BeraRarity.RARE,
    values: [1, 2, 3],
    type: BeraType.REMOVE_CARDS,
    action: BeraAction.ON_DISCARD,
    trigger: (value: number, cards: CardPosition[]) => {
      return cards.every(
        (card) => CARD_RANKS[card.rank] < CARD_RANKS[CardRank.TEN]
      ) && cards.length <= value
        ? 1
        : 0;
    },
  },
  [Bera.STRONG]: {
    name: "Strong",
    description:
      "Every played card permanently gains +{{value}} Chips when scored",
    cost: 5,
    rarity: BeraRarity.UNCOMMON,
    values: [5, 10, 15],
    type: BeraType.INCREASE_CHIPS,
    action: BeraAction.ON_SCORED,
    trigger: (value: number) => {
      return value;
    },
  },
  [Bera.CLOUD]: {
    name: "Cloud",
    description: "Earn ${{value}} for each 9 in your full deck at end of round",
    cost: 7,
    rarity: BeraRarity.UNCOMMON,
    values: [1, 2, 3],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_ENDED,
    trigger: (value: number, _: CardPosition[], state: GameStore) => {
      const nines = [
        ...state.deckCards,
        ...state.discards.flat(),
        ...state.playedHands.flat(),
        ...state.handCards,
      ].filter((card) => card.rank === CardRank.NINE).length;
      return value * nines;
    },
  },
  [Bera.SOCKS]: {
    name: "Socks",
    description: "Gains x{{value}} Mult if played hand contains a Two Pair",
    cost: 6,
    rarity: BeraRarity.UNCOMMON,
    values: [0.1, 0.2, 0.3],
    type: BeraType.MUL_MULT,
    action: BeraAction.INDEP,
    trigger: (value: number, cards: CardPosition[], state: GameStore) => {
      let count = 0;
      state.playedHands.forEach((hand) => {
        const rankCounts = countRanks(hand);
        const pairs = rankCounts.filter((count) => count >= 2);
        count += pairs.length;
      });
      return 1 + count * value;
    },
  },
  [Bera.X]: {
    name: "X",
    description:
      "Earn ${{value}} for each discarded [rank], rank changes every round",
    cost: 4,
    rarity: BeraRarity.COMMON,
    values: [5, 7, 10],
    type: BeraType.ADD_GOLD,
    action: BeraAction.ON_DISCARD,
    trigger: (value: number, cards: CardPosition[]) => {
      // from 2 to A
      const randomRank =
        Object.values(CARD_RANKS)[
          Math.floor(Math.random() * Object.values(CARD_RANKS).length)
        ];
      const validCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === randomRank
      );
      return validCards.length > 0 ? value * validCards.length : 0;
    },
  },
};

// TypeScript type for the stats
export type BeraStats = {
  name: string;
  description: string;
  cost: number;
  rarity: BeraRarity;
  values: [number, number, number]; // tuple of 3 numbers
  type: BeraType;
  action: BeraAction;
  trigger: (value: number, cards: CardPosition[], state: GameStore) => number;
};
