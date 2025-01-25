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
} from "@/utils/constants";
import { Breakdown, type PokerHand } from "@/types/hands";
import { BERA_STATS, BeraType } from "./beraStats";
import { getRankCounts, isFlush, isStraight } from "./atomic";
import { CalculationOption, GameStore } from "@/types/games";
import { BeraPosition } from "@/types/beras";

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
    let totalMult = pokerHand.mult;
    let totalChips = pokerHand.chips;
    const breakdowns: Breakdown[] = [];
    state.playingBeras
      .filter((bera) => BERA_STATS[bera.bera].action === GameAction.ON_PLAYED)
      .forEach((bera) => {
        const { type, trigger, values } = BERA_STATS[bera.bera];
        const value = trigger(values[0], playedCards, state);
        switch (type) {
          case BeraType.MUL_MULT:
            totalMult *= value;
            break;
          case BeraType.ADD_GOLD:
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
            state.addBooster(FLOWERS[trigger(values[0], playedCards, state)]);
            break;
          case BeraType.GEN_STICKER:
            state.addBooster(STICKERS[trigger(values[0], playedCards, state)]);
            break;
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
          breakdowns,
          totalChips,
          totalMult,
          options,
        });
        if (result) {
          totalMult = result.totalMult;
          totalChips = result.totalChips;
        }
      });

    const {
      chips: inHandChips,
      mult: inHandMult,
      breakdowns: inHandBreakdowns,
    } = this.triggerInHandCards(inHandCards, state, totalChips, totalMult);

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
    breakdowns,
    totalChips,
    totalMult,
    options,
  }: {
    bera: BeraPosition;
    cards: CardPosition[];
    state: GameStore;
    breakdowns: Breakdown[];
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
    const { values, trigger, type } = BERA_STATS[bera.bera];
    const value = trigger(values[0], cards, state);

    if (!value) return;
    let unit: Unit;

    switch (type) {
      case BeraType.ADD_CHIPS:
        unit = Unit.CHIPS;
        totalChips += value;
        break;
      case BeraType.ADD_MULT:
        unit = Unit.MULT;
        totalMult += value;
        break;
      case BeraType.ADD_GOLD:
        unit = Unit.GOLD;
        state.modifyGold(value);
        break;
      case BeraType.MUL_MULT:
        unit = Unit.X_MULT;
        totalMult *= value;
        break;
      case BeraType.GEN_FLOWER:
        state.addBooster(FLOWERS[value]);
        break;
      case BeraType.GEN_STICKER:
        state.addBooster(STICKERS[value]);
        break;
      case BeraType.GEN_MEME:
        state.addBooster(MEMES[value]);
        break;
      case BeraType.RETRIGGER: {
        let result;
        if (options?.isScored) {
          result = this.triggerScoredCards(
            cards,
            state,
            totalChips,
            totalMult,
            { ...options, retrigger: true }
          );
        } else if (options?.isInHand) {
          result = this.triggerInHandCards(
            cards,
            state,
            totalChips,
            totalMult,
            { ...options, retrigger: true }
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
      if (options?.breakdown) {
        breakdowns.push({
          cards: [card.id],
          beras: [],
          values: [value],
          units: [Unit.CHIPS],
          chips,
          mult,
        });
      }

      console.log(breakdowns);

      state.playingBeras
        .filter(
          (bera) =>
            BERA_STATS[bera.bera].action === GameAction.ON_SCORED &&
            (options?.retrigger
              ? BERA_STATS[bera.bera].type !== BeraType.RETRIGGER
              : true)
        )
        .forEach((bera) => {
          const result = this.triggerBera({
            bera,
            cards: [card],
            state,
            breakdowns: breakdowns,
            totalChips: chips,
            totalMult: mult,
            options: { ...options, isScored: true },
          });
          if (result) {
            mult = result.totalMult;
            chips = result.totalChips;
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
            (options?.retrigger
              ? BERA_STATS[bera.bera].type !== BeraType.RETRIGGER
              : true)
        )
        .forEach((bera) => {
          const result = this.triggerBera({
            bera,
            cards: [card],
            state,
            breakdowns: breakdowns,
            totalChips: chips,
            totalMult: mult,
            options: { ...options, isInHand: true },
          });
          if (result) {
            mult = result.totalMult;
            chips = result.totalChips;
          }
        });
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
