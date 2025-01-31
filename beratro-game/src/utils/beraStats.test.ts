import { BERA_STATS } from "./beraStats";
import { Bera, CardSuit, CardRank, Flower } from "./constants";
import type { GameStore } from "../types/games";
import type { CardPosition } from "../types/cards";
import { jest } from "@jest/globals";

describe("Bera Stats", () => {
  let mockGameStore: GameStore;
  let mockCard: CardPosition;

  beforeEach(() => {
    mockGameStore = {
      handCards: [],
      selectedCards: [],
      deckCards: [],
      discards: [],
      playedHands: [],
      playingBeras: [],
      addedCards: [],
      maxDiscards: 3,
      modifyGold: jest.fn(),
    } as unknown as GameStore;

    mockCard = {
      id: "test-id",
      suit: CardSuit.HEARTS,
      rank: CardRank.ACE,
      index: 0,
    };
  });

  describe("BABY Bera", () => {
    it("should give base mult value", () => {
      const result = BERA_STATS[Bera.BABY].trigger(4, [], mockGameStore);
      expect(result).toBe(4);
    });
  });

  describe("Suit Beras", () => {
    it.each([
      [Bera.HEART, CardSuit.HEARTS],
      [Bera.DIAMOND, CardSuit.DIAMONDS],
      [Bera.CLUB, CardSuit.CLUBS],
      [Bera.SPADE, CardSuit.SPADES],
    ])("%s should give mult when card suit matches", (bera, suit) => {
      mockCard.suit = suit;
      const result = BERA_STATS[bera].trigger(3, [mockCard], mockGameStore);
      expect(result).toBe(3);
    });

    it.each([
      [Bera.HEART, CardSuit.DIAMONDS],
      [Bera.DIAMOND, CardSuit.CLUBS],
      [Bera.CLUB, CardSuit.SPADES],
      [Bera.SPADE, CardSuit.HEARTS],
    ])("%s should give 0 when card suit doesn't match", (bera, suit) => {
      mockCard.suit = suit;
      const result = BERA_STATS[bera].trigger(3, [mockCard], mockGameStore);
      expect(result).toBe(0);
    });
  });

  describe("Hand Type Beras", () => {
    describe("TWINS Bera", () => {
      it("should give chips when hand has a pair", () => {
        const cards = [
          { ...mockCard, rank: CardRank.ACE },
          { ...mockCard, rank: CardRank.ACE },
        ];
        const result = BERA_STATS[Bera.TWINS].trigger(50, cards, mockGameStore);
        expect(result).toBe(50);
      });

      it("should give 0 when no pair", () => {
        const cards = [
          { ...mockCard, rank: CardRank.ACE },
          { ...mockCard, rank: CardRank.KING },
        ];
        const result = BERA_STATS[Bera.TWINS].trigger(50, cards, mockGameStore);
        expect(result).toBe(0);
      });
    });

    describe("TRIPLETS Bera", () => {
      it("should give chips when hand has three of a kind", () => {
        const cards = [
          { ...mockCard, rank: CardRank.ACE },
          { ...mockCard, rank: CardRank.ACE },
          { ...mockCard, rank: CardRank.ACE },
        ];
        const result = BERA_STATS[Bera.TRIPLETS].trigger(
          100,
          cards,
          mockGameStore
        );
        expect(result).toBe(100);
      });
    });

    describe("CLIMB Bera", () => {
      it("should give chips when hand has a straight", () => {
        const cards = [
          { ...mockCard, rank: CardRank.ACE },
          { ...mockCard, rank: CardRank.TWO },
          { ...mockCard, rank: CardRank.THREE },
          { ...mockCard, rank: CardRank.FOUR },
          { ...mockCard, rank: CardRank.FIVE },
        ];
        const result = BERA_STATS[Bera.CLIMB].trigger(
          100,
          cards,
          mockGameStore
        );
        expect(result).toBe(100);
      });
    });

    describe("UNIFORM Bera", () => {
      it("should give chips when hand has a flush", () => {
        const cards = [
          { ...mockCard, rank: CardRank.ACE },
          { ...mockCard, rank: CardRank.THREE },
          { ...mockCard, rank: CardRank.FIVE },
          { ...mockCard, rank: CardRank.SEVEN },
          { ...mockCard, rank: CardRank.NINE },
        ];
        const result = BERA_STATS[Bera.UNIFORM].trigger(
          80,
          cards,
          mockGameStore
        );
        expect(result).toBe(80);
      });
    });
  });

  describe("Special Card Beras", () => {
    describe("MOTHER_CARE Bera", () => {
      it("should have chance to create flower when queen is played", () => {
        mockCard.rank = CardRank.QUEEN;
        // Run multiple times to test probability
        let flowersCreated = 0;
        for (let i = 0; i < 1000; i++) {
          const result = BERA_STATS[Bera.MOTHER_CARE].trigger(
            1,
            [mockCard],
            mockGameStore
          );
          if (result > 0) flowersCreated++;
        }
        expect(flowersCreated).toBeGreaterThan(0);
      });
    });

    describe("CROWN Bera", () => {
      it("should give mult when king is held", () => {
        mockCard.rank = CardRank.KING;
        const result = BERA_STATS[Bera.CROWN].trigger(
          1.5,
          [mockCard],
          mockGameStore
        );
        expect(result).toBe(1.5);
      });
    });

    describe("FISH Bera", () => {
      it("should give gold when ace is held", () => {
        mockCard.rank = CardRank.ACE;
        const result = BERA_STATS[Bera.FISH].trigger(
          1,
          [mockCard],
          mockGameStore
        );
        expect(result).toBe(1);
      });
    });
  });

  describe("Game State Beras", () => {
    describe("AIRDROP Bera", () => {
      it("should multiply based on discarded aces", () => {
        mockGameStore.discards = [
          [
            { ...mockCard, rank: CardRank.ACE },
            { ...mockCard, rank: CardRank.ACE },
          ],
        ];
        const result = BERA_STATS[Bera.AIRDROP].trigger(1, [], mockGameStore);
        expect(result).toBe(3); // 1 + (1 * 2)
      });
    });

    describe("BAG Bera", () => {
      it("should increase hand size", () => {
        const result = BERA_STATS[Bera.BAG].trigger(2, [], mockGameStore);
        expect(result).toBe(2);
      });
    });

    describe("STAR Bera", () => {
      it("should multiply based on bera levels", () => {
        mockGameStore.playingBeras = [
          { bera: Bera.BABY, level: 2, id: "1", index: 0 },
          { bera: Bera.HEART, level: 1, id: "2", index: 1 },
        ];
        const result = BERA_STATS[Bera.STAR].trigger(0.25, [], mockGameStore);
        expect(result).toBe(1.75); // 1 + (0.25 * 3)
      });
    });
  });

  describe("Bera Properties", () => {
    it("each bera should have required properties", () => {
      Object.entries(BERA_STATS).forEach(([beraKey, bera]) => {
        expect(bera.name).toBeDefined();
        expect(bera.description).toBeDefined();
        expect(bera.cost).toBeGreaterThan(0);
        expect(bera.rarity).toBeDefined();
        expect(bera.values).toHaveLength(3);
        expect(bera.type).toBeDefined();
        expect(bera.action).toBeDefined();
        expect(typeof bera.trigger).toBe("function");
      });
    });
  });

  describe("Hand Size Based Beras", () => {
    describe("CHIP Bera", () => {
      it("should give mult when hand has 3 or fewer cards", () => {
        const cards = [
          { ...mockCard, rank: CardRank.ACE },
          { ...mockCard, rank: CardRank.KING },
          { ...mockCard, rank: CardRank.QUEEN },
        ];
        const result = BERA_STATS[Bera.CHIP].trigger(20, cards, mockGameStore);
        expect(result).toBe(20);
      });

      it("should give 0 when hand has more than 3 cards", () => {
        const cards = Array(4).fill(mockCard);
        const result = BERA_STATS[Bera.CHIP].trigger(
          20,
          cards as CardPosition[],
          mockGameStore
        );
        expect(result).toBe(0);
      });
    });

    describe("CRAWL Bera", () => {
      it("should multiply mult when hand has exactly 4 cards", () => {
        const cards = Array(4).fill(mockCard);
        const result = BERA_STATS[Bera.CRAWL].trigger(
          2,
          cards as CardPosition[],
          mockGameStore
        );
        expect(result).toBe(2);
      });

      it("should give 0 when hand does not have 4 cards", () => {
        const cards = Array(3).fill(mockCard);
        const result = BERA_STATS[Bera.CRAWL].trigger(
          2,
          cards as CardPosition[],
          mockGameStore
        );
        expect(result).toBe(0);
      });
    });
  });

  describe("Face Card Related Beras", () => {
    describe("SHY Bera", () => {
      it("should give mult when hand has no face cards", () => {
        const cards = [
          { ...mockCard, rank: CardRank.TEN },
          { ...mockCard, rank: CardRank.NINE },
        ];
        const result = BERA_STATS[Bera.SHY].trigger(20, cards, mockGameStore);
        expect(result).toBe(20);
      });

      it("should give 0 when hand has face cards", () => {
        const cards = [
          { ...mockCard, rank: CardRank.KING },
          { ...mockCard, rank: CardRank.NINE },
        ];
        const result = BERA_STATS[Bera.SHY].trigger(20, cards, mockGameStore);
        expect(result).toBe(0);
      });
    });

    describe("DROOL Bera", () => {
      it("should multiply mult when first card is a face card", () => {
        const cards = [
          { ...mockCard, rank: CardRank.KING },
          { ...mockCard, rank: CardRank.NINE },
        ];
        const result = BERA_STATS[Bera.DROOL].trigger(2, cards, mockGameStore);
        expect(result).toBe(2);
      });
    });
  });

  describe("Game State Beras", () => {
    describe("LUSCIOUS Bera", () => {
      it("should multiply mult based on used flowers", () => {
        mockGameStore.usedFlowers = [Flower.BLOSSOM, Flower.BLOSSOM];
        const result = BERA_STATS[Bera.LUSCIOUS].trigger(
          0.1,
          [],
          mockGameStore
        );
        expect(result).toBe(1.2); // 1 + (0.1 * 2)
      });
    });

    describe("BADGE Bera", () => {
      it("should give chips based on added cards", () => {
        mockGameStore.addedCards = [[mockCard, mockCard]];
        const result = BERA_STATS[Bera.BADGE].trigger(50, [], mockGameStore);
        expect(result).toBe(100); // 50 * 2 cards
      });
    });

    describe("NOPE Bera", () => {
      it("should multiply mult based on discarded cards", () => {
        mockGameStore.discards = [[mockCard, mockCard]];
        const result = BERA_STATS[Bera.NOPE].trigger(2, [], mockGameStore);
        expect(result).toBe(4); // 2 * 2 cards
      });
    });
  });

  describe("End of Round Beras", () => {
    describe("GIFT Bera", () => {
      it("should give gold at end of round", () => {
        const result = BERA_STATS[Bera.GIFT].trigger(4, [], mockGameStore);
        expect(result).toBe(4);
      });
    });

    describe("CLOUD Bera", () => {
      it("should give gold based on nines in deck", () => {
        mockGameStore.deckCards = [
          { ...mockCard, rank: CardRank.NINE },
          { ...mockCard, rank: CardRank.NINE },
        ];
        const result = BERA_STATS[Bera.CLOUD].trigger(1, [], mockGameStore);
        expect(result).toBe(2); // $1 * 2 nines
      });
    });
  });

  describe("Card Removal Beras", () => {
    describe("SLEEP Bera", () => {
      it("should remove cards below rank 10 when within limit", () => {
        const cards = [
          { ...mockCard, rank: CardRank.NINE },
          { ...mockCard, rank: CardRank.EIGHT },
        ];
        const result = BERA_STATS[Bera.SLEEP].trigger(2, cards, mockGameStore);
        expect(result).toBe(1);
      });

      it("should not remove cards when above limit", () => {
        const cards = Array(3).fill({ ...mockCard, rank: CardRank.NINE });
        const result = BERA_STATS[Bera.SLEEP].trigger(
          2,
          cards as CardPosition[],
          mockGameStore
        );
        expect(result).toBe(0);
      });
    });
  });
});
