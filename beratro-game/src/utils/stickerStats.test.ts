import { STICKER_STATS } from "./stickerStats";
import { Sticker, Unit, GameAction, HandType } from "./constants";
import type { GameStore } from "../types/games";
import { jest } from "@jest/globals";

describe("Sticker Stats", () => {
  let mockGameStore: GameStore;

  beforeEach(() => {
    mockGameStore = {
      handCards: [],
      selectedCards: [],
      modifyGold: jest.fn(),
      addBooster: jest.fn(),
      activateBooster: jest.fn(),
      lastHandType: null,
    } as unknown as GameStore;
  });

  describe("BLUEBERRY Sticker", () => {
    it("should give 50 chips when scored", () => {
      const result = STICKER_STATS[Sticker.BLUEBERRY].trigger(mockGameStore);
      expect(result).toBe(50);
    });
  });

  describe("STRAWBERRY Sticker", () => {
    it("should give 10 mult when scored", () => {
      const result = STICKER_STATS[Sticker.STRAWBERRY].trigger(mockGameStore);
      expect(result).toBe(10);
    });
  });

  describe("CHILLI Sticker", () => {
    it("should give 1.5x mult when scored", () => {
      const result = STICKER_STATS[Sticker.CHILLI].trigger(mockGameStore);
      expect(result).toBe(1.5);
    });
  });

  describe("TOMATO Sticker", () => {
    it("should give 1.5x mult while held", () => {
      const result = STICKER_STATS[Sticker.TOMATO].trigger(mockGameStore);
      expect(result).toBe(1.5);
    });
  });

  describe("BANANA Sticker", () => {
    it("should give $3 when scored", () => {
      const result = STICKER_STATS[Sticker.BANANA].trigger(mockGameStore);
      expect(result).toBe(3);
    });
  });

  describe("BEE Sticker", () => {
    it("should give $3 when this card stays in hand ", () => {
      const result = STICKER_STATS[Sticker.BEE].trigger(mockGameStore);
      expect(result).toBe(3);
    });
  });

  describe("FROG Sticker", () => {
    it("should activate random meme", () => {
      const result = STICKER_STATS[Sticker.FROG].trigger(mockGameStore);
      expect(result).toBe(1);
      expect(mockGameStore.activateBooster).toHaveBeenCalledWith(
        expect.objectContaining({
          boosterType: "meme",
          id: expect.any(String),
          index: 0,
        })
      );
    });
  });

  describe("BUTTERFLY Sticker", () => {
    it("should not activate flower when no last hand type", () => {
      const result = STICKER_STATS[Sticker.BUTTERFLY].trigger(mockGameStore);
      expect(result).toBe(0);
      expect(mockGameStore.activateBooster).not.toHaveBeenCalled();
    });

    it("should activate corresponding flower when last hand type exists", () => {
      mockGameStore.lastHandType = HandType.StraightFlush;
      const result = STICKER_STATS[Sticker.BUTTERFLY].trigger(mockGameStore);
      expect(result).toBeGreaterThan(0);
      expect(mockGameStore.activateBooster).toHaveBeenCalledWith(
        expect.objectContaining({
          boosterType: "flower",
          id: expect.any(String),
          index: 0,
        })
      );
    });
  });

  describe("PANDA Sticker", () => {
    it("should retrigger 1 time", () => {
      const result = STICKER_STATS[Sticker.PANDA].trigger(mockGameStore);
      expect(result).toBe(1);
    });
  });

  describe("EARTH Sticker", () => {
    it("should give 10 mult when scored", () => {
      const result = STICKER_STATS[Sticker.EARTH].trigger(mockGameStore);
      expect(result).toBe(10);
    });
  });

  describe("WATER Sticker", () => {
    it("should give 50 chips when scored", () => {
      const result = STICKER_STATS[Sticker.WATER].trigger(mockGameStore);
      expect(result).toBe(50);
    });
  });

  describe("FIRE Sticker", () => {
    it("should give 1.5x mult when scored", () => {
      const result = STICKER_STATS[Sticker.FIRE].trigger(mockGameStore);
      expect(result).toBe(1.5);
    });
  });

  describe("AIR Sticker", () => {
    it("should cost 0 slot", () => {
      const result = STICKER_STATS[Sticker.AIR].trigger(mockGameStore);
      expect(result).toBe(1);
    });
  });

  describe("Sticker Properties", () => {
    it.each([
      ["BLUEBERRY", Unit.CHIPS, GameAction.ON_SCORED],
      ["STRAWBERRY", Unit.MULT, GameAction.ON_SCORED],
      ["CHILLI", Unit.X_MULT, GameAction.ON_SCORED],
      ["TOMATO", Unit.X_MULT, GameAction.ON_HELD],
      ["BANANA", Unit.GOLD, GameAction.ON_SCORED],
      ["BEE", Unit.GOLD, GameAction.ON_ENDED],
      ["FROG", Unit.MEME, GameAction.ON_DISCARD],
      ["BUTTERFLY", Unit.FLOWER, GameAction.ON_ENDED],
      ["PANDA", Unit.RETRIGGER, GameAction.ON_RETRIGGERED],
      ["EARTH", Unit.MULT, GameAction.ON_SCORED],
      ["WATER", Unit.CHIPS, GameAction.ON_SCORED],
      ["FIRE", Unit.X_MULT, GameAction.ON_SCORED],
      ["AIR", Unit.ZERO_SLOT, GameAction.INDEP],
    ])("should have correct properties for %s", (stickerName, unit, action) => {
      const sticker = STICKER_STATS[stickerName as Sticker];
      expect(sticker.type).toBe(unit);
      expect(sticker.action).toBe(action);
      expect(sticker.id).toBeDefined();
      expect(typeof sticker.name).toBe("string");
      expect(typeof sticker.description).toBe("string");
      expect(typeof sticker.emoji).toBe("string");
    });
  });
});
