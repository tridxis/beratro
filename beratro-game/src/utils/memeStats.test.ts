import { MEME_STATS } from "./memeStats";
import { Meme, CardSuit, CardRank, Bera } from "./constants";
import type { GameStore } from "../types/games";
import { v4 as uuidv4 } from "uuid";
import { jest } from "@jest/globals";

describe("Meme Stats", () => {
  let mockGameStore: GameStore;

  beforeEach(() => {
    // Setup basic mock store before each test
    mockGameStore = {
      handCards: [],
      selectedCards: [],
      convertCards: jest.fn(),
      removeCards: jest.fn(),
      addCardsToHand: jest.fn(),
      modifyGold: jest.fn(),
      addBooster: jest.fn(),
      playingBeras: [],
      usedMemes: [],
      gold: 10,
    } as unknown as GameStore;
  });

  describe("THIS Meme", () => {
    it("should convert left card into right card when 2 cards are selected", () => {
      const cardId1 = uuidv4();
      const cardId2 = uuidv4();
      mockGameStore.selectedCards = [cardId1, cardId2];
      mockGameStore.handCards = [
        { id: cardId2, suit: CardSuit.HEARTS, rank: CardRank.ACE, index: 0 },
      ];

      const result = MEME_STATS[Meme.THIS].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.convertCards).toHaveBeenCalledWith(
        [cardId1],
        mockGameStore.handCards[0]
      );
    });

    it("should fail when not exactly 2 cards are selected", () => {
      mockGameStore.selectedCards = [uuidv4()];
      const result = MEME_STATS[Meme.THIS].trigger(mockGameStore);
      expect(result).toBe(false);
    });
  });

  describe("WASTED Meme", () => {
    it("should remove up to 2 selected cards", () => {
      mockGameStore.selectedCards = [uuidv4(), uuidv4()];

      const result = MEME_STATS[Meme.WASTED].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.removeCards).toHaveBeenCalled();
    });

    it("should fail when no cards are selected", () => {
      mockGameStore.selectedCards = [];
      const result = MEME_STATS[Meme.WASTED].trigger(mockGameStore);
      expect(result).toBe(false);
    });
  });

  describe("STRONG_BONK Meme", () => {
    it("should increase rank of selected cards by 1", () => {
      const cardId = uuidv4();
      mockGameStore.selectedCards = [cardId];
      mockGameStore.handCards = [
        { id: cardId, rank: CardRank.KING, suit: CardSuit.HEARTS, index: 0 },
      ];

      const result = MEME_STATS[Meme.STRONG_BONK].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.handCards[0].rank).toBe(CardRank.ACE);
    });
  });

  describe("SILLY_DRAGON Meme", () => {
    it("should convert 3 cards to random card from selection", () => {
      const cards = [uuidv4(), uuidv4(), uuidv4()];
      mockGameStore.selectedCards = cards;
      mockGameStore.handCards = cards.map((id, index) => ({
        id,
        suit: CardSuit.HEARTS,
        rank: CardRank.ACE,
        index,
      }));

      const result = MEME_STATS[Meme.SILLY_DRAGON].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.convertCards).toHaveBeenCalledWith(
        cards,
        expect.any(Object)
      );
    });
  });

  describe("SPIDER_POINTING Meme", () => {
    it("should clone 1 selected card", () => {
      const cardId = uuidv4();
      mockGameStore.selectedCards = [cardId];
      mockGameStore.handCards = [
        { id: cardId, suit: CardSuit.HEARTS, rank: CardRank.ACE, index: 0 },
      ];

      const result = MEME_STATS[Meme.SPIDER_POINTING].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.addCardsToHand).toHaveBeenCalledWith([
        expect.objectContaining({
          suit: CardSuit.HEARTS,
          rank: CardRank.ACE,
          id: expect.any(String),
          index: expect.any(Number),
        }),
      ]);
    });
  });

  describe("HEART_TRIGGED Meme", () => {
    it("should convert cards to hearts", () => {
      const cards = [uuidv4(), uuidv4()];
      mockGameStore.selectedCards = cards;

      const result = MEME_STATS[Meme.HEART_TRIGGED].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.convertCards).toHaveBeenCalledWith(cards, {
        suit: CardSuit.HEARTS,
      });
    });
  });

  describe("DARKER Meme", () => {
    it("should convert cards to spades", () => {
      const cards = [uuidv4(), uuidv4()];
      mockGameStore.selectedCards = cards;

      const result = MEME_STATS[Meme.DARKER].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.convertCards).toHaveBeenCalledWith(cards, {
        suit: CardSuit.SPADES,
      });
    });
  });

  describe("BEAR_SUIT Meme", () => {
    it("should give the right sell value of beras", () => {
      mockGameStore.playingBeras = [
        { bera: Bera.BABY, index: 0, id: uuidv4(), level: 1 },
        { bera: Bera.HEART, index: 1, id: uuidv4(), level: 1 },
      ];

      const result = MEME_STATS[Meme.BEAR_SUIT].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.modifyGold).toHaveBeenCalledWith(3);
    });
    it("should give sell value of beras up to 50", () => {
      mockGameStore.playingBeras = [
        { bera: Bera.CROWN, index: 0, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 1, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 2, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 3, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 4, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 5, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 6, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 7, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 8, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 9, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 10, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 11, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 12, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 13, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 14, id: uuidv4(), level: 1 },
        { bera: Bera.CROWN, index: 15, id: uuidv4(), level: 1 },
      ];

      const result = MEME_STATS[Meme.BEAR_SUIT].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.modifyGold).toHaveBeenCalledWith(50); // Max cap
    });
  });

  describe("BALLOON Meme", () => {
    it("should double gold up to 20", () => {
      mockGameStore.gold = 15;

      const result = MEME_STATS[Meme.BALLOON].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.modifyGold).toHaveBeenCalledWith(15);
    });

    it("should cap at 20 gold", () => {
      mockGameStore.gold = 30;

      const result = MEME_STATS[Meme.BALLOON].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.modifyGold).toHaveBeenCalledWith(20);
    });
  });

  describe("LAST_PLACE Meme", () => {
    it("should remove 3 random cards and give 10 gold", () => {
      mockGameStore.handCards = Array(5)
        .fill(null)
        .map(() => ({
          id: uuidv4(),
          suit: CardSuit.HEARTS,
          rank: CardRank.ACE,
          index: 0,
        }));

      const result = MEME_STATS[Meme.LAST_PLACE].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.removeCards).toHaveBeenCalled();
      expect(mockGameStore.modifyGold).toHaveBeenCalledWith(10);
    });
  });

  describe("PEPE Meme", () => {
    it("should create last used meme card", () => {
      const lastMeme = Meme.BALLOON;
      mockGameStore.usedMemes = [lastMeme];

      const result = MEME_STATS[Meme.PEPE].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.addBooster).toHaveBeenCalledWith(lastMeme, "meme");
    });

    it("should fail if no memes were used", () => {
      mockGameStore.usedMemes = [];
      const result = MEME_STATS[Meme.PEPE].trigger(mockGameStore);
      expect(result).toBe(false);
    });
  });

  describe("GALAXY_BRAIN Meme", () => {
    it("should convert cards to clubs", () => {
      const cards = [uuidv4(), uuidv4()];
      mockGameStore.selectedCards = cards;

      const result = MEME_STATS[Meme.GALAXY_BRAIN].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.convertCards).toHaveBeenCalledWith(cards, {
        suit: CardSuit.CLUBS,
      });
    });

    it("should fail when no cards are selected", () => {
      mockGameStore.selectedCards = [];
      const result = MEME_STATS[Meme.GALAXY_BRAIN].trigger(mockGameStore);
      expect(result).toBe(false);
    });

    it("should fail when more than 3 cards are selected", () => {
      mockGameStore.selectedCards = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
      const result = MEME_STATS[Meme.GALAXY_BRAIN].trigger(mockGameStore);
      expect(result).toBe(false);
    });
  });

  describe("SEAGULL Meme", () => {
    it("should convert cards to diamonds", () => {
      const cards = [uuidv4(), uuidv4()];
      mockGameStore.selectedCards = cards;

      const result = MEME_STATS[Meme.SEAGULL].trigger(mockGameStore);

      expect(result).toBe(true);
      expect(mockGameStore.convertCards).toHaveBeenCalledWith(cards, {
        suit: CardSuit.DIAMONDS,
      });
    });

    it("should fail when no cards are selected", () => {
      mockGameStore.selectedCards = [];
      const result = MEME_STATS[Meme.SEAGULL].trigger(mockGameStore);
      expect(result).toBe(false);
    });

    it("should fail when more than 3 cards are selected", () => {
      mockGameStore.selectedCards = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
      const result = MEME_STATS[Meme.SEAGULL].trigger(mockGameStore);
      expect(result).toBe(false);
    });
  });
});
