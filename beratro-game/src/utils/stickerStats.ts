import { Flower, GameAction, MEMES, Sticker, Unit } from "./constants";
import { GameStore } from "@/types/games";
import { FLOWER_STATS, FlowerStats } from "./flowerStats";
import { v4 as uuidv4 } from "uuid";

export enum StickerRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
}

export type StickerStats = {
  id: string;
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
        id: uuidv4(),
        index: 0,
      });
      return 1;
    },
    emoji: "🐸",
  },
  [Sticker.BUTTERFLY]: {
    id: uuidv4(),
    name: "Butterfly",
    description:
      "Create flower while this card stays in hand at the end of the round",
    type: Unit.FLOWER,
    action: GameAction.ON_ENDED,
    rarity: StickerRarity.UNCOMMON,
    kind: "animal",
    trigger: (state: GameStore) => {
      const lastHandType = state.lastHandType;
      if (!lastHandType) return 0;

      const [flowerKey, flower] = Object.entries(FLOWER_STATS).find(
        ([, flower]) => flower.hand === lastHandType
      ) as [string, FlowerStats];
      if (!flower) return 0;

      state.activateBooster({
        booster: flowerKey as Flower,
        boosterType: "flower",
        id: uuidv4(),
        index: 0,
      });

      return flower.id;
    },
    emoji: "🦋",
  },
  [Sticker.PANDA]: {
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
