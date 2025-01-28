import { Flower, GameAction, MEMES, Sticker, Unit } from "./constants";
import { GameStore } from "@/types/games";
import { FLOWER_STATS, FlowerStats } from "./flowerStats";
import { Booster } from "@/components/cards/Booster";

export enum StickerRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
}

export type StickerStats = {
  id: number;
  name: string;
  description: string;
  type: Unit;
  action: GameAction;
  rarity: StickerRarity;
  trigger: (state: GameStore) => number;
  kind: "fruit" | "animal" | "bera";
  emoji: string;
};

export const STICKER_STATS: Record<Sticker, StickerStats> = {
  [Sticker.BLUEBERRY]: {
    id: 1,
    name: "Blueberry",
    description: "+50 Chips when this card is scored",
    type: Unit.CHIPS,
    action: GameAction.ON_SCORED,
    rarity: StickerRarity.COMMON,
    kind: "fruit",
    trigger: () => 50,
    emoji: "🫐",
  },
  [Sticker.STRAWBERRY]: {
    id: 2,
    name: "Strawberry",
    description: "+10 Mult when this card is scored",
    type: Unit.MULT,
    action: GameAction.ON_SCORED,
    rarity: StickerRarity.COMMON,
    kind: "fruit",
    trigger: () => 10,
    emoji: "🍓",
  },

  [Sticker.CHILLI]: {
    id: 3,
    name: "Chilli",
    description: "x1.5 Mult when this card is scored",
    type: Unit.X_MULT,
    action: GameAction.ON_SCORED,
    rarity: StickerRarity.UNCOMMON,
    kind: "fruit",
    trigger: () => 1.5,
    emoji: "🌶️",
  },
  [Sticker.TOMATO]: {
    id: 4,
    name: "Tomato",
    description: "x1.5 Mult while this card stays in hand",
    type: Unit.X_MULT,
    action: GameAction.ON_HELD,
    rarity: StickerRarity.UNCOMMON,
    kind: "fruit",
    trigger: () => 1.5,
    emoji: "🍅",
  },
  [Sticker.BANANA]: {
    id: 5,
    name: "Banana",
    description: "Earn $3 when this card is scored",
    type: Unit.GOLD,
    action: GameAction.ON_SCORED,
    rarity: StickerRarity.COMMON,
    kind: "fruit",
    trigger: () => 3,
    emoji: "🍌",
  },
  [Sticker.BEE]: {
    id: 6,
    name: "Bee",
    description: "Earn $3 when this card stays in hand at the end of the round",
    action: GameAction.ON_ENDED,
    type: Unit.GOLD,
    rarity: StickerRarity.COMMON,
    kind: "animal",
    trigger: (state) => {
      state.modifyGold(3);
      return 3;
    },
    emoji: "🐝",
  },
  [Sticker.FROG]: {
    id: 7,
    name: "Frog",
    description: "Create meme when this card is discarded",
    type: Unit.MEME,
    action: GameAction.ON_DISCARD,
    rarity: StickerRarity.COMMON,
    kind: "animal",
    trigger: (state) => {
      const randomMeme = MEMES[Math.floor(Math.random() * MEMES.length)];
      state.activateBooster({
        booster: randomMeme,
        boosterType: "meme",
        id: 0,
        index: 0,
      });
      return 1;
    },
    emoji: "🐸",
  },
  [Sticker.BUTTERFLY]: {
    id: 8,
    name: "Butterfly",
    description:
      "Create flower while this card stays in hand at the end of the round",
    type: Unit.FLOWER,
    action: GameAction.ON_ENDED,
    rarity: StickerRarity.UNCOMMON,
    kind: "animal",
    trigger: (state: GameStore) => {
      // Get the last played hand
      const lastHandType = state.lastHandType;

      if (!lastHandType) return 0;

      // Get array of flower IDs from FLOWER_STATS
      const [flowerKey, flower] = Object.entries(FLOWER_STATS).find(
        ([_, flower]) => flower.hand === lastHandType
      ) as [string, FlowerStats];
      if (!flower) return 0;

      state.activateBooster({
        booster: flowerKey as Flower,
        boosterType: "flower",
        id: 0,
        index: 0,
      });

      return flower.id;
    },
    emoji: "🦋",
  },
  [Sticker.PANDA]: {
    id: 9,
    name: "Panda",
    description: "Retrigger this card 1 time",
    type: Unit.RETRIGGER,
    action: GameAction.ON_RETRIGGERED,
    rarity: StickerRarity.RARE,
    kind: "animal",
    trigger: () => 1,
    emoji: "🐼",
  },
  [Sticker.EARTH]: {
    id: 10,
    name: "Earth",
    description: "+10 Mult when this card is scored",
    type: Unit.MULT,
    action: GameAction.ON_SCORED,
    rarity: StickerRarity.COMMON,
    kind: "bera",
    trigger: () => 10,
    emoji: "🪨",
  },
  [Sticker.WATER]: {
    id: 11,
    name: "Water",
    description: "+50 Chips when this card is scored",
    type: Unit.CHIPS,
    action: GameAction.ON_SCORED,
    rarity: StickerRarity.COMMON,
    kind: "bera",
    trigger: () => 50,
    emoji: "💧",
  },
  [Sticker.FIRE]: {
    id: 12,
    name: "Fire",
    description: "x1.5 Mult when this card is scored",
    type: Unit.X_MULT,
    action: GameAction.ON_SCORED,
    rarity: StickerRarity.UNCOMMON,
    kind: "bera",
    trigger: () => 1.5,
    emoji: "🔥",
  },
  [Sticker.AIR]: {
    id: 13,
    name: "Air",
    description: "Cost 0 slot",
    action: GameAction.INDEP,
    type: Unit.ZERO_SLOT,
    rarity: StickerRarity.RARE,
    kind: "bera",
    trigger: () => 1,
    emoji: "🍃",
  },
};

export const STICKERS = Object.values(STICKER_STATS);
