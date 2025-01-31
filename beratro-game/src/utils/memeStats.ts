import { BERA_STATS } from "./beraStats";
import { Meme, CardSuit, CardRank, CARD_RANKS } from "./constants";
import { GameStore } from "@/types/games";
import { v4 as uuidv4 } from "uuid";

export type MemeStats = {
  id: string;
  name: string;
  description: string;
  minTargets: number;
  maxTargets: number;
  trigger: (state: GameStore) => boolean;
};

export const MEME_STATS: Record<Meme, MemeStats> = {
  [Meme.THIS]: {
    id: uuidv4(),
    name: "This",
    description: "Convert the left card into the right card",
    minTargets: 2,
    maxTargets: 2,
    trigger: (state) => {
      if (state.selectedCards.length !== 2) return false;
      const [left, right] = state.selectedCards;
      state.convertCards(
        [left],
        (state.handCards || []).find((card) => card.id === right) || {}
      );
      return true;
    },
  },
  [Meme.WASTED]: {
    id: uuidv4(),
    name: "Wasted",
    description: "Remove up to 2 selected cards",
    minTargets: 1,
    maxTargets: 2,
    trigger: (state) => {
      if (state.selectedCards.length > 2 || state.selectedCards.length === 0)
        return false;
      state.removeCards();
      return true;
    },
  },
  [Meme.STRONG_BONK]: {
    id: uuidv4(),
    name: "Strong Bonk",
    description: "Increase rank of up to 2 selected cards by 1",
    minTargets: 1,
    maxTargets: 2,
    trigger: (state) => {
      if (state.selectedCards.length > 2 || state.selectedCards.length === 0)
        return false;

      // Find selected cards in hand
      const selectedHandCards = state.handCards.filter((card) =>
        state.selectedCards.includes(card.id)
      );

      // Increase rank by 1 for each selected card
      selectedHandCards.forEach((card) => {
        const currentRankValue = CARD_RANKS[card.rank];
        const ranks = Object.entries(CARD_RANKS);

        // Find next rank (if not already at Ace)
        const nextRank = ranks.find(
          ([_, value]) => value === currentRankValue + 1
        );
        if (nextRank) {
          card.rank = nextRank[0] as CardRank;
        }
      });

      return true;
    },
  },
  [Meme.SILLY_DRAGON]: {
    id: uuidv4(),
    name: "Silly Dragon",
    description: "Change 3 selected cards to random card in 3 cards",
    minTargets: 3,
    maxTargets: 3,
    trigger: (state) => {
      if (state.selectedCards.length !== 3) return false;
      const selectedHandCards = state.handCards.filter((card) =>
        state.selectedCards.includes(card.id)
      );
      const randomCard =
        selectedHandCards[Math.floor(Math.random() * selectedHandCards.length)];
      state.convertCards(state.selectedCards, randomCard);
      return true;
    },
  },
  [Meme.SPIDER_POINTING]: {
    id: uuidv4(),
    name: "Spider Pointing",
    description: "Clone 1 selected card",
    minTargets: 1,
    maxTargets: 1,
    trigger: (state) => {
      if (state.selectedCards.length !== 1) return false;
      const selectedCard = state.handCards.find(
        (card) => card.id === state.selectedCards[0]
      );
      if (!selectedCard) return false;
      state.addCardsToHand([
        {
          ...selectedCard,
          id: uuidv4(),
          index: state.handCards[state.handCards.length - 1].index + 0.001,
        },
      ]);
      return true;
    },
  },
  [Meme.HEART_TRIGGED]: {
    id: uuidv4(),
    name: "Heart Trigged",
    description: "Convert up to 3 selected cards to Heart",
    minTargets: 1,
    maxTargets: 3,
    trigger: (state) => {
      if (state.selectedCards.length > 3 || state.selectedCards.length === 0)
        return false;
      state.convertCards(state.selectedCards, { suit: CardSuit.HEARTS });
      return true;
    },
  },
  [Meme.DARKER]: {
    id: uuidv4(),
    name: "Darker",
    description: "Convert up to 3 cards to Spade",
    minTargets: 1,
    maxTargets: 3,
    trigger: (state) => {
      if (state.selectedCards.length > 3 || state.selectedCards.length === 0)
        return false;
      state.convertCards(state.selectedCards, { suit: CardSuit.SPADES });
      return true;
    },
  },
  [Meme.GALAXY_BRAIN]: {
    id: uuidv4(),
    name: "Galaxy Brain",
    description: "Convert up to 3 cards to Club",
    minTargets: 1,
    maxTargets: 3,
    trigger: (state) => {
      if (state.selectedCards.length > 3 || state.selectedCards.length === 0)
        return false;
      state.convertCards(state.selectedCards, { suit: CardSuit.CLUBS });
      return true;
    },
  },
  [Meme.SEAGULL]: {
    id: uuidv4(),
    name: "Seagull",
    description: "Convert up to 3 cards to Diamond",
    minTargets: 1,
    maxTargets: 3,
    trigger: (state) => {
      if (state.selectedCards.length > 3 || state.selectedCards.length === 0)
        return false;
      state.convertCards(state.selectedCards, { suit: CardSuit.DIAMONDS });
      return true;
    },
  },
  [Meme.BEAR_SUIT]: {
    id: uuidv4(),
    name: "Bear Suit",
    description: "Give the total sell value of all current Beras (Max of $50)",
    minTargets: 0,
    maxTargets: 0,
    trigger: (state) => {
      const beraSellValues = state.playingBeras.map((bera) =>
        Math.floor(BERA_STATS[bera.bera].cost / 2)
      );
      const goldEarned = Math.min(
        beraSellValues.reduce((acc, value) => acc + value, 0),
        50
      );
      state.modifyGold(goldEarned);
      return true;
    },
  },
  [Meme.BALLOON]: {
    id: uuidv4(),
    name: "Balloon",
    description: "Double gold (Max of $20)",
    minTargets: 0,
    maxTargets: 0,
    trigger: (state) => {
      const goldEarned = Math.min(state.gold, 20);
      state.modifyGold(goldEarned);
      return true;
    },
  },
  [Meme.LAST_PLACE]: {
    id: uuidv4(),
    name: "Last Place",
    description: "Remove randomly 3 cards in hand, get 10$",
    minTargets: 0,
    maxTargets: 0,
    trigger: (state) => {
      const randomCards = state.handCards
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      state.removeCards(randomCards);
      state.modifyGold(10);
      return true;
    },
  },
  [Meme.PEPE]: {
    id: uuidv4(),
    name: "Pepe",
    description: "Create the last Meme Card used in this game",
    minTargets: 0,
    maxTargets: 0,
    trigger: (state) => {
      const lastMeme = state.usedMemes[state.usedMemes.length - 1];
      if (!lastMeme) return false;
      state.addBooster(lastMeme, "meme");
      return true;
    },
  },
};

export const MEMES = Object.values(MEME_STATS);
