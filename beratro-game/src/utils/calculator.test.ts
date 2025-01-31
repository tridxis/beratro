import { Calculator } from "./calculator";
import {
  Bera,
  CardRank,
  CardSuit,
  HandType,
  Sticker,
  Unit,
  GameAction,
} from "./constants";
import type { GameStore } from "../types/games";
import { jest } from "@jest/globals";
import { CardPosition } from "../types/cards";

describe("Calculator", () => {
  let mockGameStore: GameStore;
  let mockCard: CardPosition;

  beforeEach(() => {
    mockGameStore = {
      handCards: [
        { id: "1", suit: CardSuit.HEARTS, rank: CardRank.ACE, index: 0 },
        { id: "2", suit: CardSuit.HEARTS, rank: CardRank.KING, index: 1 },
        { id: "3", suit: CardSuit.HEARTS, rank: CardRank.QUEEN, index: 2 },
      ],
      selectedCards: ["1", "2", "3"],
      playingBeras: [],
      playedHands: [],
      discards: [],
      deckCards: [],
      modifyGold: jest.fn(),
      addBooster: jest.fn(),
      modifyCards: jest.fn(),
      removeCards: jest.fn(),
    } as unknown as GameStore;

    mockCard = {
      id: "test-id",
      suit: CardSuit.HEARTS,
      rank: CardRank.ACE,
      index: 0,
    };
  });

  describe("calculate", () => {
    it("should calculate basic hand value", () => {
      const result = Calculator.calculate(mockGameStore);
      expect(result.score).toBeGreaterThan(0);
      expect(result.pokerHand.chips).toBeGreaterThan(0);
      expect(result.pokerHand.mult).toBeGreaterThan(0);
    });

    it("should identify poker hand type", () => {
      mockGameStore.handCards = [
        { id: "1", suit: CardSuit.HEARTS, rank: CardRank.ACE, index: 0 },
        { id: "2", suit: CardSuit.HEARTS, rank: CardRank.KING, index: 1 },
        { id: "3", suit: CardSuit.HEARTS, rank: CardRank.QUEEN, index: 2 },
        { id: "4", suit: CardSuit.HEARTS, rank: CardRank.JACK, index: 3 },
        { id: "5", suit: CardSuit.HEARTS, rank: CardRank.TEN, index: 4 },
      ];
      mockGameStore.selectedCards = ["1", "2", "3", "4", "5"];

      const result = Calculator.calculate(mockGameStore);
      expect(result.pokerHand.handType).toBe(HandType.StraightFlush);
      expect(result.pokerHand.chips).toBe(100);
      expect(result.pokerHand.mult).toBe(8);
    });

    it("should include card modifiers in calculation", () => {
      mockGameStore.handCards = [
        {
          id: "1",
          suit: CardSuit.HEARTS,
          rank: CardRank.ACE,
          index: 0,
          chips: 10,
          mult: 2,
          xMult: 1.5,
        },
      ];
      mockGameStore.selectedCards = ["1"];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      // Base value for Ace (11) + added chips (10)
      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          cards: ["1"],
          values: [10],
          units: [Unit.CHIPS],
        })
      );

      // Check mult modifier
      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          cards: ["1"],
          values: [2],
          units: [Unit.MULT],
        })
      );

      // Check xMult modifier
      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          cards: ["1"],
          values: [1.5],
          units: [Unit.X_MULT],
        })
      );
    });

    it("should calculate in-hand card effects", () => {
      mockGameStore.handCards = [
        {
          id: "1",
          suit: CardSuit.HEARTS,
          rank: CardRank.ACE,
          index: 0,
        },
        {
          id: "2",
          suit: CardSuit.SPADES,
          rank: CardRank.KING,
          index: 1,
          fruitSticker: Sticker.TOMATO,
        },
      ];
      mockGameStore.selectedCards = ["1"];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      // Should include effect from card staying in hand
      expect(result.inHandBreakdowns).toContainEqual(
        expect.objectContaining({
          cards: ["2"],
          values: [1.5],
          units: [Unit.X_MULT],
        })
      );
    });

    it("should apply bera effects", () => {
      // Add a bera that gives chips when hearts are played
      mockGameStore.playingBeras = [
        {
          bera: Bera.HEART,
          level: 0,
          id: "bera1",
          index: 0,
        },
      ];

      mockGameStore.handCards = [
        {
          id: "1",
          suit: CardSuit.HEARTS, // This should trigger the HEART bera
          rank: CardRank.ACE,
          index: 0,
        },
      ];
      mockGameStore.selectedCards = ["1"];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      // Should include bera effect in breakdowns
      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          beras: ["bera1"],
          values: expect.any(Array),
          units: expect.any(Array),
        })
      );
    });

    it("should handle cards with stickers", () => {
      mockGameStore.handCards = [
        {
          id: "1",
          suit: CardSuit.HEARTS,
          rank: CardRank.ACE,
          index: 0,
          fruitSticker: Sticker.BLUEBERRY, // Gives 50 chips when scored
        },
      ];
      mockGameStore.selectedCards = ["1"];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      // Should include sticker effect in breakdowns
      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          cards: ["1"],
          values: [50],
          units: [Unit.CHIPS],
        })
      );
    });
  });

  describe("Bera Effects", () => {
    it.each([
      [Bera.HEART, 3, Unit.MULT, CardSuit.HEARTS],
      [Bera.DIAMOND, 3, Unit.MULT, CardSuit.DIAMONDS],
      [Bera.CLUB, 3, Unit.MULT, CardSuit.CLUBS],
      [Bera.SPADE, 3, Unit.MULT, CardSuit.SPADES],
    ])("should apply %s bera effect", (bera, value, unit, suit) => {
      mockGameStore.playingBeras = [{ bera, level: 0, id: "bera1", index: 0 }];

      mockGameStore.handCards = [
        {
          id: "1",
          suit: suit || CardSuit.HEARTS,
          rank: CardRank.ACE,
          index: 0,
        },
      ];
      mockGameStore.selectedCards = ["1"];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          beras: ["bera1"],
          values: [value],
          units: [unit],
        })
      );
    });

    it.each([
      [Bera.TWINS, 50, Unit.CHIPS, [CardRank.ACE, CardRank.ACE]],
      [
        Bera.TRIPLETS,
        100,
        Unit.CHIPS,
        [CardRank.ACE, CardRank.ACE, CardRank.ACE],
      ],
    ])(
      "should apply %s bera effect for hand combinations",
      (bera, value, unit, ranks) => {
        mockGameStore.playingBeras = [
          { bera, level: 0, id: "bera1", index: 0 },
        ];

        mockGameStore.handCards = ranks.map((rank, i) => ({
          id: `${i}`,
          suit: CardSuit.HEARTS,
          rank,
          index: i,
        }));
        mockGameStore.selectedCards = ranks.map((_, i) => `${i}`);

        const result = Calculator.calculate(mockGameStore, { breakdown: true });

        expect(result.playingBreakdowns).toContainEqual(
          expect.objectContaining({
            beras: ["bera1"],
            values: [value],
            units: [unit],
          })
        );
      }
    );

    it("should apply STAR bera effect based on bera levels", () => {
      mockGameStore.playingBeras = [
        { bera: Bera.STAR, level: 0, id: "star", index: 0 },
        { bera: Bera.BABY, level: 2, id: "baby", index: 1 },
        { bera: Bera.HEART, level: 1, id: "heart", index: 2 },
      ];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          beras: ["star"],
          values: [1.75], // 1 + (0.25 * 3)
          units: [Unit.X_MULT],
        })
      );
    });

    it.each([
      [Bera.DOUBLES, 8, Unit.MULT, [CardRank.ACE, CardRank.ACE]],
      [Bera.FAMILY, 12, Unit.MULT, [CardRank.ACE, CardRank.ACE, CardRank.ACE]],
      [
        Bera.BUILDER,
        12,
        Unit.MULT,
        [
          CardRank.ACE,
          CardRank.TWO,
          CardRank.THREE,
          CardRank.FOUR,
          CardRank.FIVE,
        ],
      ],
      [
        Bera.COLORLESS,
        10,
        Unit.MULT,
        [
          CardRank.ACE,
          CardRank.TWO,
          CardRank.THREE,
          CardRank.FOUR,
          CardRank.FIVE,
        ],
      ],
    ])(
      "should apply %s bera effect for hand patterns",
      (bera, value, unit, ranks) => {
        mockGameStore.playingBeras = [
          { bera, level: 0, id: "bera1", index: 0 },
        ];

        mockGameStore.handCards = ranks.map((rank, i) => ({
          id: `${i}`,
          suit: CardSuit.HEARTS,
          rank,
          index: i,
        }));
        mockGameStore.selectedCards = ranks.map((_, i) => `${i}`);

        const result = Calculator.calculate(mockGameStore, { breakdown: true });

        expect(result.playingBreakdowns).toContainEqual(
          expect.objectContaining({
            beras: ["bera1"],
            values: [value],
            units: [unit],
          })
        );
      }
    );

    it.each([
      [Bera.CHIP, 20, Unit.MULT, 3],
      [Bera.CRAWL, 2, Unit.X_MULT, 4],
    ])(
      "should apply %s bera effect based on hand size",
      (bera, value, unit, handSize) => {
        mockGameStore.playingBeras = [
          { bera, level: 0, id: "bera1", index: 0 },
        ];

        mockGameStore.handCards = Array(handSize)
          .fill(null)
          .map((_, i) => ({
            id: `${i}`,
            suit: CardSuit.HEARTS,
            rank: CardRank.ACE,
            index: i,
          }));
        mockGameStore.selectedCards = mockGameStore.handCards.map(
          (card) => card.id
        );

        const result = Calculator.calculate(mockGameStore, { breakdown: true });

        expect(result.playingBreakdowns).toContainEqual(
          expect.objectContaining({
            beras: ["bera1"],
            values: [value],
            units: [unit],
          })
        );
      }
    );

    it.each([
      [Bera.SCARF, 30, Unit.CHIPS, 3], // 30 chips per remaining discard, 3 max discards
    ])(
      "should apply %s bera effect for game state",
      (bera, value, unit, maxDiscards) => {
        mockGameStore.playingBeras = [
          { bera, level: 0, id: "bera1", index: 0 },
        ];
        mockGameStore.selectedCards = ["1"];
        mockGameStore.maxDiscards = maxDiscards;
        mockGameStore.discards = []; // No discards used yet

        const result = Calculator.calculate(mockGameStore, { breakdown: true });

        // For SCARF: value * (maxDiscards - discards.length)
        const expectedValue = bera === Bera.SCARF ? value * maxDiscards : value;

        expect(result.playingBreakdowns).toContainEqual(
          expect.objectContaining({
            beras: ["bera1"],
            values: [expectedValue],
            units: [unit],
          })
        );
      }
    );

    it("should apply BADGE bera effect based on added cards", () => {
      mockGameStore.playingBeras = [
        { bera: Bera.BADGE, level: 0, id: "bera1", index: 0 },
      ];
      mockGameStore.addedCards = [
        [mockCard, mockCard], // 2 cards in first addition
        [mockCard], // 1 card in second addition
      ];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          beras: ["bera1"],
          values: [150], // 50 chips * 3 added cards
          units: [Unit.CHIPS],
        })
      );
    });

    it.each([
      [Bera.SHY, 20, Unit.MULT],
      [Bera.DROOL, 2, Unit.X_MULT],
    ])(
      "should apply %s bera effect for card conditions",
      (bera, value, unit) => {
        mockGameStore.playingBeras = [
          { bera, level: 0, id: "bera1", index: 0 },
        ];

        // For SHY: no face cards, for DROOL: first card is face card
        const firstCard = bera === Bera.SHY ? CardRank.TEN : CardRank.KING;
        mockGameStore.handCards = [
          {
            id: "1",
            suit: CardSuit.HEARTS,
            rank: firstCard,
            index: 0,
          },
        ];
        mockGameStore.selectedCards = ["1"];

        const result = Calculator.calculate(mockGameStore, { breakdown: true });

        expect(result.playingBreakdowns).toContainEqual(
          expect.objectContaining({
            beras: ["bera1"],
            values: [value],
            units: [unit],
          })
        );
      }
    );

    it("should apply BIG_TINY bera effect for low cards", () => {
      mockGameStore.playingBeras = [
        { bera: Bera.BIG_TINY, level: 0, id: "bera1", index: 0 },
      ];

      mockGameStore.handCards = [
        {
          id: "1",
          suit: CardSuit.HEARTS,
          rank: CardRank.NINE,
          index: 0,
        },
      ];
      mockGameStore.selectedCards = ["1"];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          beras: ["bera1"],
          values: [1],
          units: [Unit.RETRIGGER],
        })
      );
    });

    it("should apply STAMMER bera effect for held cards", () => {
      mockGameStore.playingBeras = [
        { bera: Bera.STAMMER, level: 0, id: "bera1", index: 0 },
        { bera: Bera.CROWN, level: 0, id: "bera2", index: 1 },
      ];

      // Add cards with held abilities to test retrigger
      mockGameStore.handCards = [
        {
          id: "1",
          suit: CardSuit.HEARTS,
          rank: CardRank.KING, // CROWN bera triggers on held King
          index: 0,
        },
        {
          id: "2",
          suit: CardSuit.HEARTS,
          rank: CardRank.ACE, // FISH bera triggers on held Ace
          index: 1,
        },
      ];
      mockGameStore.selectedCards = ["2"]; // Select first card to trigger calculation

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      const crownEffects = result.inHandBreakdowns.filter(
        (breakdown) =>
          breakdown.beras?.includes("bera2") &&
          breakdown.values[0] === 1.5 &&
          breakdown.units[0] === Unit.X_MULT
      );
      expect(crownEffects).toHaveLength(2); // CROWN effect should appear twice

      expect(result.inHandBreakdowns).toContainEqual(
        expect.objectContaining({
          beras: ["bera1"],
          values: [1],
          units: [Unit.RETRIGGER],
        })
      );
    });

    it("should apply SOCKS bera effect based on pairs in played hands", () => {
      mockGameStore.playingBeras = [
        { bera: Bera.SOCKS, level: 0, id: "bera1", index: 0 },
      ];
      mockGameStore.playedHands = [
        [
          // First hand with a pair
          { id: "1", suit: CardSuit.HEARTS, rank: CardRank.ACE, index: 0 },
          { id: "2", suit: CardSuit.SPADES, rank: CardRank.ACE, index: 1 },
        ],
        [
          // Second hand with two pairs
          { id: "3", suit: CardSuit.HEARTS, rank: CardRank.KING, index: 2 },
          { id: "4", suit: CardSuit.SPADES, rank: CardRank.KING, index: 3 },
          { id: "5", suit: CardSuit.HEARTS, rank: CardRank.QUEEN, index: 4 },
          { id: "6", suit: CardSuit.SPADES, rank: CardRank.QUEEN, index: 5 },
        ],
      ];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          beras: ["bera1"],
          values: [1.3], // 1 + (0.1 * 3 pairs)
          units: [Unit.X_MULT],
        })
      );
    });
  });

  describe("Sticker Effects", () => {
    it.each([
      [Sticker.BLUEBERRY, 50, Unit.CHIPS],
      [Sticker.STRAWBERRY, 10, Unit.MULT],
      [Sticker.CHILLI, 1.5, Unit.X_MULT],
      [Sticker.BANANA, 3, Unit.GOLD],
    ])("should apply %s sticker effect when scored", (sticker, value, unit) => {
      mockGameStore.handCards = [
        {
          id: "1",
          suit: CardSuit.HEARTS,
          rank: CardRank.ACE,
          index: 0,
          fruitSticker: sticker,
        },
      ];
      mockGameStore.selectedCards = ["1"];

      const result = Calculator.calculate(mockGameStore, { breakdown: true });

      expect(result.playingBreakdowns).toContainEqual(
        expect.objectContaining({
          cards: ["1"],
          values: [value],
          units: [unit],
        })
      );
    });

    it.each([[Sticker.TOMATO, 1.5]])(
      "should apply %s sticker effect while in hand",
      (sticker, value) => {
        mockGameStore.handCards = [
          {
            id: "1",
            suit: CardSuit.HEARTS,
            rank: CardRank.ACE,
            index: 0,
          },
          {
            id: "2",
            suit: CardSuit.SPADES,
            rank: CardRank.KING,
            index: 1,
            fruitSticker: sticker,
          },
        ];
        mockGameStore.selectedCards = ["1"];

        const result = Calculator.calculate(mockGameStore, { breakdown: true });

        expect(result.inHandBreakdowns).toContainEqual(
          expect.objectContaining({
            cards: ["2"],
            values: [value],
            units: [sticker === Sticker.TOMATO ? Unit.X_MULT : Unit.GOLD],
          })
        );
      }
    );
  });

  describe("Hand Type Effects", () => {
    it.each([
      [
        "Flush Five",
        [
          { rank: CardRank.ACE, suit: CardSuit.HEARTS },
          { rank: CardRank.ACE, suit: CardSuit.HEARTS },
          { rank: CardRank.ACE, suit: CardSuit.HEARTS },
          { rank: CardRank.ACE, suit: CardSuit.HEARTS },
          { rank: CardRank.ACE, suit: CardSuit.HEARTS },
        ],
        HandType.FlushFive,
        160,
        16,
      ],
      [
        "Straight Flush",
        [
          { rank: CardRank.NINE, suit: CardSuit.HEARTS },
          { rank: CardRank.EIGHT, suit: CardSuit.HEARTS },
          { rank: CardRank.SEVEN, suit: CardSuit.HEARTS },
          { rank: CardRank.SIX, suit: CardSuit.HEARTS },
          { rank: CardRank.FIVE, suit: CardSuit.HEARTS },
        ],
        HandType.StraightFlush,
        100,
        8,
      ],
      // Add more hand types here
    ])("should identify %s correctly", (name, cards, type, chips, mult) => {
      mockGameStore.handCards = cards.map((card, i) => ({
        ...card,
        id: `${i}`,
        index: i,
      }));
      mockGameStore.selectedCards = cards.map((_, i) => `${i}`);

      const result = Calculator.calculate(mockGameStore);

      expect(result.pokerHand.handType).toBe(type);
      expect(result.pokerHand.chips).toBe(chips);
      expect(result.pokerHand.mult).toBe(mult);
    });
  });
});
