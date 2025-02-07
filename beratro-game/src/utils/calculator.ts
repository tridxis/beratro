import { type CardPosition } from "@/types/cards";
import {
  CARD_RANKS,
  CardRank,
  FLOWERS,
  HAND_VALUES,
  HandType,
  MEMES,
  STICKERS,
  Unit,
  GameAction,
  Sticker,
} from "@/utils/constants";
import { Breakdown, type PokerHand } from "@/types/hands";
import { BERA_STATS, BeraType } from "./beraStats";
import { getRankCounts, isFlush, isStraight } from "./atomic";
import { CalculationOption, GameStore } from "@/types/games";
import { BeraPosition } from "@/types/beras";
import { STICKER_STATS } from "./stickerStats";

export class Calculator {
  static calculate(
    state: GameStore,
    options?: CalculationOption
  ): {
    score: number;
    playingBreakdowns: Breakdown[];
    inHandBreakdowns: Breakdown[];
    pokerHand: PokerHand;
    options?: CalculationOption;
  } {
    // Calculate score for the played hand

    const playedCards = state.selectedCards
      .map((id) => state.handCards.find((card) => card.id === id)!)
      .sort((a, b) => a.index - b.index);

    const inHandCards = state.handCards.filter(
      (card) => !state.selectedCards.some((id) => id === card.id)
    );

    const pokerHand = this.identifyPokerHand(playedCards);
    let totalMult =
      pokerHand.mult +
      ((state.handLevels[pokerHand.handType] || 1) - 1) *
        HAND_VALUES[pokerHand.handType].multLvl;
    let totalChips =
      pokerHand.chips +
      ((state.handLevels[pokerHand.handType] || 1) - 1) *
        HAND_VALUES[pokerHand.handType].chipsLvl;
    const breakdowns: Breakdown[] = [];
    state.playingBeras
      .filter((bera) => BERA_STATS[bera.bera].action === GameAction.ON_PLAYED)
      .forEach((bera) => {
        const { type, trigger, values } = BERA_STATS[bera.bera];
        const value = trigger(values[bera.level - 1], playedCards, state);
        if (value) {
          switch (type) {
            case BeraType.ADD_CHIPS:
              totalChips += value;
              breakdowns.push({
                cards: [],
                beras: [bera.id],
                values: [value],
                units: [Unit.CHIPS],
                chips: totalChips,
                mult: totalMult,
              });
              break;
            case BeraType.MUL_MULT:
              totalMult *= value;
              breakdowns.push({
                cards: [],
                beras: [bera.id],
                values: [value],
                units: [Unit.X_MULT],
                chips: totalChips,
                mult: totalMult,
              });
              break;
            case BeraType.ADD_GOLD:
              console.log("add gold bera", value);
              state.modifyGold(value);
              breakdowns.push({
                cards: [],
                beras: [bera.id],
                values: [value],
                units: [Unit.GOLD],
                chips: 0,
                mult: 0,
              });
              break;
            case BeraType.GEN_FLOWER:
              state.addBooster(FLOWERS[value - 1], "flower");
              break;
            case BeraType.GEN_STICKER:
              state.addBooster(STICKERS[value - 1], "sticker");
              break;
          }
        }
      });
    const {
      chips,
      mult,
      breakdowns: playingBreakdowns,
    } = this.triggerScoredCards(
      pokerHand.scoredCards,
      state,
      totalChips,
      totalMult,
      options
    );

    breakdowns.push(...playingBreakdowns);

    totalMult = mult;
    totalChips = chips;

    state.playingBeras
      .filter((bera) => BERA_STATS[bera.bera].action === GameAction.INDEP)
      .forEach((bera) => {
        const result = this.triggerBera({
          bera,
          cards: pokerHand.scoredCards,
          state,
          totalChips,
          totalMult,
          options,
        });
        if (result) {
          totalMult = result.totalMult;
          totalChips = result.totalChips;
          if (options?.breakdown) {
            breakdowns.push(...result.breakdowns);
          }
        }
      });

    const {
      chips: inHandChips,
      mult: inHandMult,
      breakdowns: inHandBreakdowns,
    } = this.triggerInHandCards(
      inHandCards,
      state,
      totalChips,
      totalMult,
      options
    );

    totalMult = inHandMult;
    totalChips = inHandChips;

    return {
      score: totalChips * totalMult,
      playingBreakdowns: breakdowns,
      inHandBreakdowns,
      pokerHand: pokerHand,
    };
  }

  private static triggerBera({
    bera,
    cards,
    state,
    totalChips,
    totalMult,
    options,
  }: {
    bera: BeraPosition;
    cards: CardPosition[];
    state: GameStore;
    totalChips: number;
    totalMult: number;
    options?: CalculationOption;
  }):
    | {
        totalChips: number;
        totalMult: number;
        breakdowns: Breakdown[];
      }
    | undefined {
    const { values, trigger, type, action } = BERA_STATS[bera.bera];
    const value = trigger(values[bera.level - 1], cards, state);

    if (!value) return;
    let unit: Unit | null = null;
    const breakdowns: Breakdown[] = [];

    const isCardBreakdown = [GameAction.ON_SCORED, GameAction.ON_HELD].includes(
      action
    );

    switch (type) {
      case BeraType.ADD_CHIPS:
        unit = Unit.CHIPS;
        totalChips += value;
        if (options?.breakdown) {
          breakdowns.push({
            cards: isCardBreakdown ? cards.map((card) => card.id) : [],
            beras: isCardBreakdown ? [] : [bera.id],
            values: [value],
            units: [Unit.CHIPS],
            chips: totalChips,
            mult: totalMult,
          });
        }
        break;
      case BeraType.ADD_MULT:
        unit = Unit.MULT;
        totalMult += value;
        if (options?.breakdown) {
          breakdowns.push({
            cards: isCardBreakdown ? cards.map((card) => card.id) : [],
            beras: isCardBreakdown ? [] : [bera.id],
            values: [value],
            units: [Unit.MULT],
            chips: totalChips,
            mult: totalMult,
          });
        }
        break;
      case BeraType.ADD_GOLD:
        unit = Unit.GOLD;
        console.log("add gold trigger bera", value);
        state.modifyGold(value);
        if (options?.breakdown) {
          breakdowns.push({
            cards: [],
            beras: [bera.id],
            values: [value],
            units: [Unit.GOLD],
            chips: totalChips,
            mult: totalMult,
          });
        }
        break;
      case BeraType.MUL_MULT:
        unit = Unit.X_MULT;
        totalMult *= value;
        if (options?.breakdown) {
          breakdowns.push({
            cards: isCardBreakdown ? cards.map((card) => card.id) : [],
            beras: isCardBreakdown ? [] : [bera.id],
            values: [value],
            units: [Unit.X_MULT],
            chips: totalChips,
            mult: totalMult,
          });
        }
        break;
      case BeraType.GEN_FLOWER:
        state.addBooster(FLOWERS[value], "flower");
        break;
      case BeraType.GEN_STICKER:
        state.addBooster(STICKERS[value], "sticker");
        break;
      case BeraType.GEN_MEME:
        state.addBooster(MEMES[value], "meme");
        break;
      case BeraType.RETRIGGER: {
        let result;
        if (options?.isScored) {
          result = this.triggerScoredCards(
            cards,
            state,
            totalChips,
            totalMult,
            { ...options, beraRetrigger: true }
          );
        } else if (options?.isInHand) {
          result = this.triggerInHandCards(
            cards,
            state,
            totalChips,
            totalMult,
            { ...options, beraRetrigger: true }
          );
        }
        if (result) {
          totalChips = result.chips;
          totalMult = result.mult;
          breakdowns.push(
            ...[
              {
                cards: [],
                beras: [bera.id],
                values: [1],
                units: [Unit.RETRIGGER],
                chips: 0,
                mult: 0,
              },
              ...result.breakdowns,
            ]
          );
        }
        break;
      }
      case BeraType.INCREASE_CHIPS:
        state.modifyCards({ chips: value });
        break;
      case BeraType.INCREASE_MULT:
        state.modifyCards({ mult: value });
        break;
      case BeraType.REMOVE_CARDS:
        state.removeCards();
        break;
      default:
        break;
    }

    if (unit != null && options?.breakdown) {
      breakdowns.push({
        cards: [],
        beras: [bera.id],
        values: [value],
        units: [unit],
        chips: totalChips,
        mult: totalMult,
      });
    }
    return { totalChips, totalMult, breakdowns };
  }

  private static triggerScoredCards(
    cards: CardPosition[],
    state: GameStore,
    chips: number,
    mult: number,
    options?: CalculationOption
  ): {
    chips: number;
    mult: number;
    breakdowns: Breakdown[];
  } {
    console.log("again", options, chips);
    const breakdowns: Breakdown[] = [];
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let value = 0;
      // Face cards (J, Q, K) are worth 10, Ace is worth 11
      if (CARD_RANKS[card.rank] === CARD_RANKS[CardRank.ACE]) {
        value = 11;
      } else if (CARD_RANKS[card.rank] > 10) {
        value = 10;
      } else {
        value = CARD_RANKS[card.rank];
      }
      chips += value;

      if (card.chips) {
        chips += card.chips;
      }
      if (options?.breakdown) {
        breakdowns.push({
          cards: [card.id],
          beras: [],
          values: [value + (card.chips || 0)],
          units: [Unit.CHIPS],
          chips,
          mult,
        });
      }
      if (card.mult) {
        mult += card.mult;
        if (options?.breakdown) {
          breakdowns.push({
            cards: [card.id],
            beras: [],
            values: [card.mult],
            units: [Unit.MULT],
            chips,
            mult,
          });
        }
      }
      if (card.xMult) {
        mult *= card.xMult;
        if (options?.breakdown) {
          breakdowns.push({
            cards: [card.id],
            beras: [],
            values: [card.xMult],
            units: [Unit.X_MULT],
            chips,
            mult,
          });
        }
      }
      if (card.fruitSticker) {
        const sticker = STICKER_STATS[card.fruitSticker];
        if (sticker.action === GameAction.ON_SCORED) {
          let unit: Unit | null = null;
          let value = 0;
          switch (sticker.type) {
            case Unit.CHIPS:
              value = sticker.trigger(state);
              chips += value;
              unit = Unit.CHIPS;
              break;
            case Unit.MULT:
              value = sticker.trigger(state);
              mult += value;
              unit = Unit.MULT;
              break;
            case Unit.X_MULT:
              value = sticker.trigger(state);
              mult *= value;
              unit = Unit.X_MULT;
              break;
            case Unit.GOLD:
              value = sticker.trigger(state);
              console.log("add gold trigger sticker", value);
              state.modifyGold(value);
              unit = Unit.GOLD;
              break;
          }

          if (options?.breakdown && unit != null) {
            breakdowns.push({
              cards: [card.id],
              beras: [],
              values: [value],
              units: [unit],
              chips,
              mult,
            });
          }
        }
      }

      state.playingBeras
        .filter(
          (bera) =>
            BERA_STATS[bera.bera].action === GameAction.ON_SCORED &&
            (options?.beraRetrigger
              ? BERA_STATS[bera.bera].type !== BeraType.RETRIGGER
              : true)
        )
        .forEach((bera) => {
          const result = this.triggerBera({
            bera,
            cards: [card],
            state,
            totalChips: chips,
            totalMult: mult,
            options: { ...options, isScored: true },
          });
          if (result) {
            mult = result.totalMult;
            chips = result.totalChips;
            if (options?.breakdown) {
              breakdowns.push(...result.breakdowns);
            }
          }
        });
    }

    console.log(chips, mult);

    return { chips, mult, breakdowns };
  }

  private static triggerInHandCards(
    cards: CardPosition[],
    state: GameStore,
    chips: number,
    mult: number,
    options?: CalculationOption
  ): {
    chips: number;
    mult: number;
    breakdowns: Breakdown[];
  } {
    const breakdowns: Breakdown[] = [];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      state.playingBeras
        .filter(
          (bera) =>
            BERA_STATS[bera.bera].action === GameAction.ON_HELD &&
            (options?.beraRetrigger
              ? BERA_STATS[bera.bera].type !== BeraType.RETRIGGER
              : true)
        )
        .forEach((bera) => {
          const result = this.triggerBera({
            bera,
            cards: [card],
            state,
            totalChips: chips,
            totalMult: mult,
            options: { ...options, isInHand: true },
          });
          if (result) {
            mult = result.totalMult;
            chips = result.totalChips;
            if (options?.breakdown) {
              breakdowns.push(...result.breakdowns);
            }
          }
        });
      if (card.fruitSticker === Sticker.TOMATO) {
        mult *= 1.5;
        if (options?.breakdown) {
          breakdowns.push({
            cards: [card.id],
            beras: [],
            values: [1.5],
            units: [Unit.X_MULT],
            chips,
            mult,
          });
        }
      } else if (
        card.animalSticker === Sticker.PANDA &&
        !options?.cardRetrigger
      ) {
        const result = this.triggerInHandCards([card], state, chips, mult, {
          ...options,
          cardRetrigger: true,
        });
        if (result) {
          chips = result.chips;
          mult = result.mult;
          if (options?.breakdown) {
            breakdowns.push(...result.breakdowns);
          }
        }
      }
    }

    return { chips, mult, breakdowns };
  }

  static identifyPokerHand(
    cards: CardPosition[]
  ): PokerHand & { scoredCards: CardPosition[] } {
    // Pre-calculate common checks that are used by multiple hand types
    const rankCounts = getRankCounts(cards);
    const { isValid: isAllSameSuit } = isFlush(cards);
    const { isValid: isStraightHand } = isStraight(cards);

    // Organize checks from most specific/valuable to least, with optimized short-circuits
    if (isAllSameSuit) {
      // Check flush-based hands first if we know it's a flush
      if (cards.every((card) => card.rank === cards[0].rank)) {
        return this.createHandResult(HandType.FlushFive, cards, cards);
      }

      const counts = Object.values(rankCounts);
      if (counts.includes(3) && counts.includes(2)) {
        return this.createHandResult(HandType.FlushHouse, cards, cards);
      }

      if (isStraightHand) {
        return this.createHandResult(HandType.StraightFlush, cards, cards);
      }

      return this.createHandResult(HandType.Flush, cards, cards);
    }

    // Check non-flush hands
    const counts = Object.values(rankCounts);
    if (counts.includes(5)) {
      return this.createHandResult(HandType.FiveOfAKind, cards, cards);
    }

    if (counts.includes(4)) {
      const rank = Object.entries(rankCounts).find(
        ([, count]) => count === 4
      )![0];
      const scoredCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === Number(rank)
      );
      return this.createHandResult(HandType.FourOfAKind, cards, scoredCards);
    }

    if (counts.includes(3) && counts.includes(2)) {
      return this.createHandResult(HandType.FullHouse, cards, cards);
    }

    if (isStraightHand) {
      return this.createHandResult(HandType.Straight, cards, cards);
    }

    if (counts.includes(3)) {
      const rank = Object.entries(rankCounts).find(
        ([, count]) => count === 3
      )![0];
      const scoredCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === Number(rank)
      );
      return this.createHandResult(HandType.ThreeOfAKind, cards, scoredCards);
    }

    const pairs = Object.entries(rankCounts).filter(([, count]) => count === 2);
    if (pairs.length === 2) {
      const scoredCards = cards.filter((card) =>
        pairs.some(([rank]) => CARD_RANKS[card.rank] === Number(rank))
      );
      return this.createHandResult(HandType.TwoPair, cards, scoredCards);
    }

    if (pairs.length === 1) {
      const rank = pairs[0][0];
      const scoredCards = cards.filter(
        (card) => CARD_RANKS[card.rank] === Number(rank)
      );
      return this.createHandResult(HandType.Pair, cards, scoredCards);
    }

    // High card (no other hands matched)
    const highestCard =
      cards.find(
        (card) => CARD_RANKS[card.rank] === CARD_RANKS[CardRank.ACE]
      ) ??
      [...cards].sort((a, b) => CARD_RANKS[b.rank] - CARD_RANKS[a.rank])[0];
    return this.createHandResult(HandType.HighCard, cards, [highestCard]);
  }

  // Helper method to create consistent hand results
  private static createHandResult(
    handType: HandType,
    cards: CardPosition[],
    scoredCards: CardPosition[]
  ): PokerHand & { scoredCards: CardPosition[] } {
    const { mult, chips } = HAND_VALUES[handType];
    return { handType, mult, chips, cards, scoredCards };
  }
}
