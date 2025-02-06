import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { DisplayCard } from "./cards/DisplayCard";
import DraggableCard from "./cards/DraggableCard";
import { Calculator } from "@/utils/calculator";
import {
  ANIMATION_MS,
  BOOSTER_PACK_INFO,
  BOOSTER_PACKS,
  Flower,
  GameAction,
  HAND_NAMES,
  HAND_VALUES,
  HandType,
  Meme,
  Sticker,
  Unit,
} from "@/utils/constants";
import { Breakdown, PokerHand } from "@/types/hands";
import { useMotionValue, useTransform, animate } from "framer-motion";
import { GameState } from "@/types/games";
import {
  RoundEndContainer,
  CashOutButton,
  FlexRow,
  Separator,
  RewardText,
  ScoreText,
  GameContainer,
  LeftPanel,
  ResetButton,
  RoundHeader,
  RoundContent,
  ScoreTarget,
  ScoreValue,
  StatsGrid,
  StatBox,
  StatValue,
  MainGameArea,
  DeckAreaContainer,
  DeckSection,
  MemesSection,
  ShopContainer,
  ShopButtonGrid,
  ShopButton,
  ShopItemsGrid,
  ShopItem,
  PriceTag,
  PlayedHandArea,
  PlayedHandContainer,
  CardRow,
  CardWrapper,
  ScorePopup,
  ChipScore,
  MultScore,
  HandCardsArea,
  ReorderGroup,
  CardSlot,
  ActionButtonsContainer,
  SortButton,
  ActionButtonGroup,
  ActionButton,
  HandScoreContainer,
  HandTypeText,
  ScoreDisplay,
  ChipsDisplay,
  MultiplierDisplay,
  LeftArea,
  HandContainer,
  BentoBox,
  DeckContainer,
  DeckDescription,
  ShopItemGrid,
  ShopSection,
  BuyButton,
  EndInfoContainer,
  EndInfoText,
  ScoreAtLeastTag,
  RetriggerScore,
  GoldScore,
  BottomButtonContainer,
  SellButton,
  StickerItem,
  SkipButton,
} from "./Game.styles";
import { BLUE_COLOR, GOLD_COLOR, RED_COLOR } from "@/utils/colors";
import { BoosterPosition, CardPosition } from "@/types/cards";
import { BERA_STATS, BeraType } from "@/utils/beraStats";
import useCalculator from "@/hooks/useCalculator";
import { BeraPosition } from "@/types/beras";
import { Booster } from "./cards/Booster";
import { STICKER_STATS } from "@/utils/stickerStats";
import { motion } from "framer-motion";
import { GlobalTooltip } from "./Tooltip";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { MEME_STATS } from "@/utils/memeStats";

// Update the vibration animation to include rotation
const vibrateAnimation = {
  initial: { x: 0, y: 0, rotate: 0, transformOrigin: "center center" },
  animate: {
    x: [
      0,
      "-0.4vw",
      "0.4vw",
      "-0.3vw",
      "0.3vw",
      "-0.2vw",
      "0.2vw",
      "-0.1vw",
      "0.1vw",
      0,
    ],
    y: [
      0,
      "0.4vw",
      "-0.4vw",
      "0.3vw",
      "-0.3vw",
      "0.2vw",
      "-0.2vw",
      "0.1vw",
      "-0.1vw",
      0,
    ],
    rotate: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0],
    transformOrigin: "center center",
    transition: {
      duration: ANIMATION_MS / 3000, // Even faster duration
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
      ease: "easeOut", // Changed to easeOut for Balatro-like decay
      repeat: 0, // Single shake that decays
    },
  },
};

// Update the hover scale animation to maintain z-index
const hoverScaleAnimation = {
  initial: {
    scale: 1,
    transformOrigin: "center center",
  },
  hover: {
    scale: 1.05,
    transformOrigin: "center center",
    transition: {
      duration: ANIMATION_MS / 2000,
      ease: "easeOut",
    },
  },
};

// Add this type to help with tooltip positioning
type TooltipPosition = "top" | "bottom" | "right";

export const Game = () => {
  const state = useGameStore();

  const {
    handCards,
    selectedCards,
    playedHands,
    sortByValue,
    sortBySuit,
    reorderCards,
    toggleSelectedCard,
    reset,
    dealCards,
    playSelectedCards,
    discardSelectedCards,
    score,
    addScore,
    discards,
    deckCards,
    maxHands,
    maxDiscards,
    currentState,
    round,
    roundGold,
    reqScore,
    setCurrentState,
    endRound,
    shopBeras,
    buyBera,
    playingBeras,
    gold,
    setLastHandType,
    nextRound,
    selectedPack,
    buyPack,
    pickItemFromPack,
    boosters,
    selectedBooster,
    setSelectedBooster,
    activateBooster,
    handLevels,
    selectedBera,
    setSelectedBera,
    modifyGold,
    setHandCards,
    boughtPacks,
    sellBera,
    sellBooster,
    skipPack,
  } = state;

  const { play } = useCalculator();

  const [lastPlayedIndex, setLastPlayedIndex] = useState<number | null>(null);

  const [bonusGolds, setBonusGolds] = useState<
    { title: string; value: number }[]
  >([]);

  const pokerHandRef = useRef<PokerHand | null>(null);

  // Add state for current breakdown at component level
  const [currentBreakdown, setCurrentBreakdown] = useState<Breakdown | null>(
    null
  );

  // Add these states for tooltip
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Add these states near the top of the Game component
  const [upgradingHand, setUpgradingHand] = useState<HandType>(HandType.Pair);

  // Add this effect to handle the notification timing
  useEffect(() => {
    if (upgradingHand) {
      const timer = setTimeout(() => {
        setUpgradingHand(undefined);
      }, 2000); // Show for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [upgradingHand]);

  const previewPokerHand = useMemo(() => {
    if (selectedCards.length === 0) return null;

    const selectedCardObjects = selectedCards
      .map((id) => handCards.find((card) => card.id === id)!)
      .sort((a, b) => a.index - b.index);

    const pokerHand = Calculator.identifyPokerHand(selectedCardObjects);

    return pokerHand;
  }, [selectedCards, handCards]);

  useEffect(() => {
    if (handCards.length === 0) {
      dealCards();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      const handCards = document.querySelectorAll(".hand-card");
      handCards.forEach((card) => {
        const instance = card as unknown as {
          setIsSelected?: (isSelected: boolean) => void;
        };
        if (instance.setIsSelected) {
          instance.setIsSelected(false);
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".booster-card")) {
        setSelectedBooster(null);
      } else if (!target.closest(".bera-item")) {
        setSelectedBera(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleOnEndedBeras = () => {
    playingBeras
      .filter((bera) => BERA_STATS[bera.bera].action === GameAction.ON_ENDED)
      .forEach((bera) => {
        const value = BERA_STATS[bera.bera].trigger(
          BERA_STATS[bera.bera].values[0],
          [],
          state
        );
        switch (BERA_STATS[bera.bera].type) {
          case BeraType.ADD_GOLD:
            setBonusGolds((prev) => [
              ...prev,
              {
                title: BERA_STATS[bera.bera].description.replace(
                  "{{value}}",
                  BERA_STATS[bera.bera].values[0].toString()
                ),
                value,
              },
            ]);
            break;
        }
      });
  };

  const handleOnEndedCards = () => {
    const cards = handCards.filter(
      (card) =>
        !selectedCards.includes(card.id) &&
        !!card.animalSticker &&
        STICKER_STATS[card.animalSticker].action === GameAction.ON_ENDED
    );
    cards.forEach((card) => {
      const sticker = STICKER_STATS[card.animalSticker as Sticker];
      console.log("on end sticker", sticker);
      switch (sticker.type) {
        case Unit.GOLD:
          sticker.trigger(state);
          break;
        case Unit.FLOWER:
          sticker.trigger(state);
          break;
      }
    });
  };

  const handleAction = (action: "play" | "discard") => {
    if (action === "play") {
      if (playedHands.length >= maxHands) {
        return;
      }
      playSelectedCards();

      const {
        score: currentScore,
        pokerHand,
        playingBreakdowns,
        inHandBreakdowns,
      } = play();

      pokerHandRef.current = pokerHand;
      setLastHandType(pokerHand.handType);
      // Update total score after all individual scores are shown
      // Animate breakdowns first
      const allBreakdowns = [...playingBreakdowns, ...inHandBreakdowns];
      let currentIndex = 0;
      setCurrentBreakdown(allBreakdowns[currentIndex]);
      currentIndex++;

      const breakdownInterval = setInterval(() => {
        if (currentIndex < allBreakdowns.length) {
          setCurrentBreakdown(allBreakdowns[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(breakdownInterval);

          // After breakdowns finish, set the final score
          addScore(currentScore);

          // Clear individual scores and reset display after original timeout
          setTimeout(() => {
            setCurrentBreakdown(null);
            setLastPlayedIndex(null);
            pokerHandRef.current = null;
            if (score + currentScore >= reqScore) {
              handleOnEndedBeras();
              handleOnEndedCards();
              setCurrentState(GameState.ROUND_ENDED);
            }
          }, ANIMATION_MS * 3);
        }
      }, ANIMATION_MS);

      setLastPlayedIndex(playedHands.length);
    } else {
      if (discards.length >= maxDiscards) {
        return;
      }

      const cards = selectedCards.map(
        (id) => handCards.find((card) => card.id === id)!
      );
      cards.forEach((card) => {
        playingBeras
          .filter(
            (bera) => BERA_STATS[bera.bera].action === GameAction.ON_DISCARD
          )
          .forEach((bera) => {
            const value = BERA_STATS[bera.bera].trigger(
              BERA_STATS[bera.bera].values[0],
              [],
              state
            );
            switch (BERA_STATS[bera.bera].type) {
              case BeraType.ADD_GOLD:
                modifyGold(value);
                break;
            }
          });
        if (card.animalSticker) {
          console.log("animal sticker", card.animalSticker);
          const sticker = STICKER_STATS[card.animalSticker];
          console.log("sticker", sticker);
          if (sticker.action === GameAction.ON_DISCARD) {
            sticker.trigger(state);
          }
        }
      });
      discardSelectedCards();
    }
    dealCards();
  };

  const useAnimatedCounter = (value: number) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) =>
      Math.round(latest).toLocaleString()
    );

    useEffect(() => {
      const controls = animate(count, value, {
        type: "tween",
        duration: 0.1,
        ease: "easeOut",
      });

      return controls.stop;
    }, [value]);

    return rounded;
  };

  const renderBreakdownScore = (
    id: string,
    type: "card" | "bera",
    ids: string[],
    values: number[],
    units: Unit[]
  ) => {
    const index = ids.indexOf(id);
    if (index === -1) return <></>;
    const value = values[index];
    const unit = units[index];
    if (
      !value ||
      (unit !== Unit.CHIPS &&
        unit !== Unit.MULT &&
        unit !== Unit.X_MULT &&
        unit !== Unit.RETRIGGER &&
        unit !== Unit.GOLD)
    ) {
      return <></>;
    }

    return (
      <ScorePopup
        type={type}
        initial={{
          opacity: 0.5,
          y: type === "card" ? "1vw" : "-1vw",
          scale: 0.5,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: type === "card" ? "1vw" : "-1vw",
          scale: 0.5,
          transition: { duration: ANIMATION_MS / 3000 },
        }}
        transition={{ duration: ANIMATION_MS / 3000 }}
      >
        {unit === Unit.CHIPS && <ChipScore>+{value}</ChipScore>}
        {(unit === Unit.MULT || unit === Unit.X_MULT) && (
          <MultScore>
            {unit === Unit.X_MULT ? "×" : "+"}
            {value}
          </MultScore>
        )}
        {unit === Unit.RETRIGGER && <RetriggerScore>Retrigger</RetriggerScore>}
        {unit === Unit.GOLD && <GoldScore>${value}</GoldScore>}
      </ScorePopup>
    );
  };

  // console.log("playingBeras", playingBeras);
  // console.log("handCards", handCards);
  // console.log("handLevels", handLevels);
  // console.log("deckCards", deckCards);

  const renderBreakdownCard = (card: CardPosition) => {
    if (!currentBreakdown) return <></>;
    const hasBreakdown = currentBreakdown.cards.includes(card.id.toString());

    return (
      <>
        {hasBreakdown && (
          <motion.div
            style={{ position: "absolute", width: "100%", height: "100%" }}
            variants={vibrateAnimation}
            initial="initial"
            animate="animate"
          />
        )}
        {renderBreakdownScore(
          card.id.toString(),
          "card",
          currentBreakdown.cards.map((card) => card.toString()),
          currentBreakdown.values,
          currentBreakdown.units
        )}
      </>
    );
  };

  const renderBreakdownBera = (bera: BeraPosition) => {
    if (!currentBreakdown) return <></>;
    return renderBreakdownScore(
      bera.id.toString(),
      "bera",
      currentBreakdown.beras.map((bera) => bera.toString()),
      currentBreakdown.values,
      currentBreakdown.units
    );
  };

  const goldEarned = useMemo(() => {
    return (
      Math.min(Math.floor(gold / 5), 5) +
      roundGold +
      maxHands -
      playedHands.length +
      bonusGolds.reduce((acc, curr) => acc + curr.value, 0)
    );
  }, [gold, roundGold, maxHands, playedHands.length, bonusGolds]);

  const pokerHand =
    pokerHandRef.current?.handType || previewPokerHand?.handType;

  // Update the handleTooltip function
  const handleTooltip = (
    show: boolean,
    content?: React.ReactNode,
    event?: React.MouseEvent,
    position: TooltipPosition = "right"
  ) => {
    if (show && content && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const tooltipHeight = rect.height * 0.6; // Estimate tooltip height as 80% of card height
      let x = 0;
      let y = 0;

      switch (position) {
        case "top":
          x = rect.left;
          y = rect.top - tooltipHeight - 20; // Subtract tooltip height plus gap
          break;
        case "bottom":
          x = rect.left;
          y = rect.bottom + 20;
          break;
        case "right":
        default:
          x = rect.right + 20;
          y = rect.top;
          break;
      }

      setTooltipPosition({ x, y });
      setTooltipContent(content);
      setIsTooltipVisible(true);
    } else {
      setIsTooltipVisible(false);
      setTooltipContent(null);
    }
  };

  // Update the getCardTooltipContent helper function
  const getCardTooltipContent = (card: CardPosition) => {
    const content = [];

    // Show base chips (rank value + card.chips)
    const rankValue = isNaN(Number(card.rank)) ? 10 : Number(card.rank);
    const totalChips = rankValue + (card.chips || 0);

    content.push(
      <div
        key="chips"
        style={{ padding: "0.2vw", backgroundColor: BLUE_COLOR }}
      >
        +{totalChips} chips
        {card.chips ? ` (${rankValue} + ${card.chips})` : ""}
      </div>
    );

    // Add sticker descriptions if present
    if (card.animalSticker) {
      content.push(
        <div key="animal" style={{ marginTop: "0.5vw" }}>
          {STICKER_STATS[card.animalSticker].emoji}{" "}
          {STICKER_STATS[card.animalSticker].description}
        </div>
      );
    }

    if (card.fruitSticker) {
      content.push(
        <div key="fruit" style={{ marginTop: "0.5vw" }}>
          {STICKER_STATS[card.fruitSticker].emoji}{" "}
          {STICKER_STATS[card.fruitSticker].description}
        </div>
      );
    }

    // If card has multiplier, show it
    if (card.mult && card.mult > 1) {
      content.push(
        <div key="mult" style={{ marginTop: "0.5vw" }}>
          ×{card.mult} multiplier
        </div>
      );
    }

    return <>{content}</>;
  };

  // Update the activateBooster handler
  const handleActivateBooster = (booster: BoosterPosition) => {
    activateBooster(booster);
    if (booster.boosterType === "flower") {
      const handType = FLOWER_STATS[booster.booster as Flower].hand;
      setUpgradingHand(handType);
    }
  };

  return (
    <GameContainer>
      <LeftArea>
        <LeftPanel>
          <ResetButton
            onClick={() => {
              reset();
              dealCards();
            }}
          >
            Reset
          </ResetButton>

          <BentoBox>
            <RoundHeader>ROUND {round}</RoundHeader>
            <RoundContent>
              <FlexRow style={{ justifyContent: "space-between" }}>
                <div>
                  <div>Score at least</div>
                  <ScoreTarget>{reqScore.toLocaleString()}</ScoreTarget>
                </div>
                <div>to earn $$$$</div>
              </FlexRow>
            </RoundContent>
          </BentoBox>

          <BentoBox style={{ padding: "1vw" }}>
            <div>Round score</div>
            <ScoreValue>
              {useAnimatedCounter(
                score ||
                  currentBreakdown?.chips ||
                  0 * (currentBreakdown?.mult || 0)
              )}
            </ScoreValue>
          </BentoBox>

          <HandScoreContainer>
            {(!!pokerHand || upgradingHand) && (
              <>
                <HandTypeText>
                  {upgradingHand ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {HAND_NAMES[upgradingHand]} Lvl{" "}
                      {handLevels[upgradingHand] || 1}
                    </motion.div>
                  ) : (
                    `${pokerHand} Lvl ${handLevels[pokerHand as HandType] || 1}`
                  )}
                </HandTypeText>
                <ScoreDisplay>
                  <ChipsDisplay
                    value={
                      currentBreakdown?.chips ||
                      (HAND_VALUES[upgradingHand]?.chips ||
                        previewPokerHand?.chips ||
                        0) +
                        ((handLevels[
                          upgradingHand || (pokerHand as HandType)
                        ] || 1) -
                          1) *
                          HAND_VALUES[upgradingHand || (pokerHand as HandType)]
                            .chipsLvl
                    }
                  />
                  <span style={{ fontSize: "2vw" }}>×</span>
                  <MultiplierDisplay
                    value={
                      currentBreakdown?.mult ||
                      (HAND_VALUES[upgradingHand]?.mult ||
                        previewPokerHand?.mult ||
                        0) +
                        ((handLevels[
                          upgradingHand || (pokerHand as HandType)
                        ] || 1) -
                          1) *
                          HAND_VALUES[upgradingHand || (pokerHand as HandType)]
                            .multLvl
                    }
                  />
                </ScoreDisplay>
              </>
            )}
          </HandScoreContainer>

          <StatsGrid>
            <StatBox>
              <div>Hands</div>
              <StatValue color={BLUE_COLOR}>
                {maxHands - playedHands.length}
              </StatValue>
            </StatBox>
            <StatBox>
              <div>Discards</div>
              <StatValue color={RED_COLOR}>
                {maxDiscards - discards.length}
              </StatValue>
            </StatBox>
            <StatBox>
              <div>Golds</div>
              <StatValue color={GOLD_COLOR}>{gold}</StatValue>
            </StatBox>
          </StatsGrid>
        </LeftPanel>
      </LeftArea>

      <MainGameArea>
        <DeckAreaContainer>
          <DeckSection>
            <DeckContainer>
              {playingBeras.map((bera, index) => (
                <ShopItem
                  key={`playing-bera-${index}`}
                  className="bera-item"
                  as={motion.div}
                  whileHover="hover"
                  variants={{
                    ...vibrateAnimation,
                    ...hoverScaleAnimation,
                  }}
                  style={{ position: "relative" }}
                  animate={
                    currentBreakdown?.beras.includes(bera.id.toString())
                      ? "animate"
                      : "initial"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBera(selectedBera === bera.id ? null : bera.id);
                  }}
                  onMouseEnter={(e) => {
                    handleTooltip(
                      true,
                      <>
                        {BERA_STATS[bera.bera].description.replace(
                          "{{value}}",
                          BERA_STATS[bera.bera].values[0].toString()
                        )}
                        {BERA_STATS[bera.bera].cumulative && (
                          <>
                            (Current:{" "}
                            {BERA_STATS[bera.bera].type === BeraType.MUL_MULT
                              ? "×"
                              : "+"}
                            {BERA_STATS[bera.bera].trigger(
                              BERA_STATS[bera.bera].values[0],
                              [],
                              state
                            )}
                            )
                          </>
                        )}
                      </>,
                      e,
                      "bottom"
                    );
                  }}
                  onMouseLeave={() => handleTooltip(false)}
                >
                  {!!bera.sticker && (
                    <StickerItem>
                      {STICKER_STATS[bera.sticker].emoji}
                    </StickerItem>
                  )}
                  {BERA_STATS[bera.bera].name}
                  <br />
                  Bera
                  {renderBreakdownBera(bera)}
                  <AnimatePresence>
                    {selectedBera === bera.id && (
                      <BottomButtonContainer
                        as={motion.div}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SellButton
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            sellBera(bera.id);
                          }}
                        >
                          Sell
                        </SellButton>
                      </BottomButtonContainer>
                    )}
                  </AnimatePresence>
                </ShopItem>
              ))}
            </DeckContainer>
            <DeckDescription>{playingBeras.length}/5</DeckDescription>
          </DeckSection>
          <MemesSection>
            <DeckContainer>
              {boosters.map((booster, index) => (
                <motion.div
                  key={`booster-${index}`}
                  whileHover="hover"
                  variants={hoverScaleAnimation}
                  style={{ position: "relative" }}
                  onMouseEnter={(e) => {
                    handleTooltip(
                      true,
                      booster.boosterType === "flower"
                        ? `Upgrade ${
                            HAND_NAMES[
                              FLOWER_STATS[booster.booster as Flower].hand
                            ]
                          } by 1 level`
                        : booster.boosterType === "sticker"
                        ? STICKER_STATS[booster.booster as Sticker].description
                        : MEME_STATS[booster.booster as Meme].description,
                      e,
                      "bottom"
                    );
                  }}
                  onMouseLeave={() => handleTooltip(false)}
                >
                  <Booster
                    item={booster}
                    isSelected={selectedBooster?.id === booster.id}
                    onUse={() => {
                      handleActivateBooster(booster);
                    }}
                    onSell={() => {
                      sellBooster(booster.id);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBooster(
                        selectedBooster?.id === booster.id ? null : booster
                      );
                    }}
                  />
                </motion.div>
              ))}
            </DeckContainer>
            <DeckDescription>{boosters.length}/2</DeckDescription>
          </MemesSection>
        </DeckAreaContainer>

        {currentState === GameState.SHOPPING && (
          <ShopContainer>
            {!selectedPack ? (
              <ShopItemsGrid>
                <ShopSection>
                  <ShopItemGrid>
                    <ShopButtonGrid>
                      <ShopButton
                        variant="primary"
                        onClick={() => {
                          nextRound();
                          dealCards();
                        }}
                      >
                        Next Round
                      </ShopButton>
                      <ShopButton variant="secondary">Reroll $5</ShopButton>
                    </ShopButtonGrid>

                    {shopBeras.map((bera, index) => (
                      <ShopItem
                        key={`pack-${index}`}
                        style={{ position: "relative" }}
                        onMouseEnter={(e) => {
                          handleTooltip(
                            true,
                            <>
                              {BERA_STATS[bera.bera].description.replace(
                                "{{value}}",
                                BERA_STATS[bera.bera].values[0].toString()
                              )}
                            </>,
                            e,
                            "top"
                          );
                        }}
                        onMouseLeave={() => handleTooltip(false)}
                      >
                        <PriceTag>${BERA_STATS[bera.bera].cost}</PriceTag>
                        {BERA_STATS[bera.bera].name}
                        <br />
                        Bera
                        <BuyButton onClick={() => buyBera(bera.id)}>
                          Buy
                        </BuyButton>
                      </ShopItem>
                    ))}
                  </ShopItemGrid>
                </ShopSection>

                <ShopSection>
                  <ShopItemGrid>
                    <div></div>
                    {BOOSTER_PACKS.map((item, index) =>
                      boughtPacks[item.type] ? (
                        <div key={`pack-${index}`}></div>
                      ) : (
                        <ShopItem
                          key={`pack-${index}`}
                          style={{ position: "relative" }}
                          onMouseEnter={(e) => {
                            handleTooltip(
                              true,
                              <>
                                <div style={{ marginTop: "1vw" }}>
                                  Contains {BOOSTER_PACK_INFO[item.type].items}
                                  <br />
                                  Pick {BOOSTER_PACK_INFO[item.type].pick} items
                                </div>
                              </>,
                              e,
                              "top"
                            );
                          }}
                          onMouseLeave={() => handleTooltip(false)}
                        >
                          <PriceTag>${item.price}</PriceTag>
                          {item.name}
                          <BuyButton
                            onClick={() => buyPack(item.type)}
                            disabled={gold < item.price}
                          >
                            Buy
                          </BuyButton>
                        </ShopItem>
                      )
                    )}
                  </ShopItemGrid>
                </ShopSection>
              </ShopItemsGrid>
            ) : (
              <div>
                <h3>
                  Please select{" "}
                  {BOOSTER_PACK_INFO[selectedPack.boosterPack].pick} items
                  below:
                </h3>
                <CardRow isLastPlayed={false}>
                  {selectedPack.items
                    .filter(
                      (item) => !selectedPack.pickedItems.includes(item.id)
                    )
                    .map((item) => (
                      <CardWrapper
                        totalCards={selectedPack.items.length}
                        key={item.id}
                        index={item.index}
                        onClick={() => pickItemFromPack(item)}
                      >
                        {(item as BoosterPosition).booster ? (
                          <motion.div
                            style={{ position: "relative" }}
                            onMouseEnter={(e) => {
                              const booster = item as BoosterPosition;
                              handleTooltip(
                                true,
                                booster.boosterType === "flower"
                                  ? `Upgrade ${
                                      HAND_NAMES[
                                        FLOWER_STATS[booster.booster as Flower]
                                          .hand
                                      ]
                                    } by 1 level`
                                  : booster.boosterType === "sticker"
                                  ? STICKER_STATS[booster.booster as Sticker]
                                      .description
                                  : MEME_STATS[booster.booster as Meme]
                                      .description,
                                e,
                                "top"
                              );
                            }}
                            onMouseLeave={() => handleTooltip(false)}
                          >
                            <Booster item={item as BoosterPosition} />
                          </motion.div>
                        ) : (
                          <motion.div
                            style={{ position: "relative" }}
                            onMouseEnter={(e) => {
                              const content = getCardTooltipContent(
                                item as CardPosition
                              );
                              if (content)
                                handleTooltip(true, content, e, "top");
                            }}
                            onMouseLeave={() => handleTooltip(false)}
                          >
                            <DisplayCard card={item as CardPosition} />
                          </motion.div>
                        )}
                      </CardWrapper>
                    ))}
                </CardRow>
                <SkipButton onClick={skipPack}>Skip Pack</SkipButton>
              </div>
            )}
          </ShopContainer>
        )}

        {currentState === GameState.ROUND_ENDED && (
          <RoundEndContainer>
            <CashOutButton
              onClick={() => {
                endRound(goldEarned);
                setBonusGolds([]);
              }}
            >
              Cash Out: ${goldEarned}
            </CashOutButton>
            <EndInfoContainer>
              <FlexRow>
                <ScoreAtLeastTag>Score as least</ScoreAtLeastTag>
                <ScoreText>{reqScore.toLocaleString()}</ScoreText>
                <RewardText>{"$".repeat(roundGold)}</RewardText>
              </FlexRow>

              <Separator />

              <FlexRow>
                <EndInfoText>Remaining Hands ($1 each)</EndInfoText>
                <RewardText>
                  {maxHands - playedHands.length > 0
                    ? "$".repeat(maxHands - playedHands.length)
                    : "-"}
                </RewardText>
              </FlexRow>

              <FlexRow>
                <EndInfoText>1 Interest per $5 (5 max)</EndInfoText>
                <RewardText>
                  {Math.floor(gold / 5) > 0
                    ? "$".repeat(Math.floor(gold / 5))
                    : "-"}
                </RewardText>
              </FlexRow>

              {bonusGolds.map((gold, index) => (
                <FlexRow key={`bonus-gold-${index}`}>
                  <EndInfoText>{gold.title}</EndInfoText>
                  <RewardText>{"$".repeat(gold.value)}</RewardText>
                </FlexRow>
              ))}
            </EndInfoContainer>
          </RoundEndContainer>
        )}

        {currentState === GameState.PLAYING && (
          <>
            <PlayedHandArea>
              {playedHands.map((hand, handIndex) => (
                <PlayedHandContainer
                  key={handIndex}
                  isLastPlayed={handIndex === lastPlayedIndex}
                >
                  <CardRow isLastPlayed={handIndex === lastPlayedIndex}>
                    {hand.map((card, index) => (
                      <div
                        key={card.id}
                        style={{
                          position: "relative",
                          marginRight: "1vw",
                        }}
                      >
                        <motion.div
                          style={{
                            position: "relative",
                            transformStyle: "preserve-3d",
                          }}
                          animate={
                            currentBreakdown?.cards.includes(card.id.toString())
                              ? "animate"
                              : "initial"
                          }
                          whileHover="hover"
                          variants={{
                            ...vibrateAnimation,
                            ...hoverScaleAnimation,
                          }}
                        >
                          <DisplayCard
                            card={card}
                            onMouseEnter={(e) => {
                              const content = getCardTooltipContent(card);
                              if (content)
                                handleTooltip(true, content, e, "top");
                            }}
                            onMouseLeave={() => handleTooltip(false)}
                          />
                        </motion.div>
                        {renderBreakdownCard(card)}
                      </div>
                    ))}
                  </CardRow>
                </PlayedHandContainer>
              ))}
            </PlayedHandArea>

            <HandCardsArea>
              <HandContainer>
                <ReorderGroup
                  axis="x"
                  values={handCards.map((card) => card.id)}
                  onReorder={(newOrder) => {
                    console.log("newOrder", newOrder);
                    reorderCards(newOrder as string[]);
                  }}
                >
                  <AnimatePresence mode="popLayout" initial={true}>
                    {handCards.map((card, index) => (
                      <CardSlot
                        key={card.id}
                        index={index}
                        totalCards={handCards.length}
                      >
                        <motion.div
                          style={{
                            position: "relative",
                            transformStyle: "preserve-3d",
                          }}
                          animate={
                            currentBreakdown?.cards.includes(card.id.toString())
                              ? "animate"
                              : "initial"
                          }
                          whileHover="hover"
                          variants={{
                            ...vibrateAnimation,
                            ...hoverScaleAnimation,
                          }}
                        >
                          <DraggableCard
                            className="hand-card"
                            card={card}
                            isSelected={selectedCards.includes(card.id)}
                            onSelect={(id) => {
                              if (!selectedCards.includes(id)) {
                                if (selectedCards.length >= 5) return;
                              }
                              toggleSelectedCard(id);
                            }}
                            onMouseEnter={(e) => {
                              const content = getCardTooltipContent(card);
                              if (content)
                                handleTooltip(true, content, e, "top");
                            }}
                            onMouseLeave={() => handleTooltip(false)}
                          />
                        </motion.div>
                        {renderBreakdownCard(card)}
                      </CardSlot>
                    ))}
                  </AnimatePresence>
                </ReorderGroup>
              </HandContainer>
            </HandCardsArea>

            <ActionButtonsContainer>
              {selectedCards.length > 0 && (
                <ActionButtonGroup
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ActionButton
                    action="play"
                    disabled={playedHands.length >= maxHands}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction("play")}
                  >
                    PLAY
                  </ActionButton>
                </ActionButtonGroup>
              )}
              <SortButton variant="value" onClick={sortByValue}>
                Sort Rank
              </SortButton>
              <SortButton variant="suit" onClick={sortBySuit}>
                Sort Suit
              </SortButton>
              {selectedCards.length > 0 && (
                <ActionButtonGroup
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <ActionButton
                    action="discard"
                    disabled={discards.length >= maxDiscards}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleAction("discard");
                    }}
                  >
                    DISCARD
                  </ActionButton>
                </ActionButtonGroup>
              )}
            </ActionButtonsContainer>
          </>
        )}
      </MainGameArea>
      <GlobalTooltip
        content={tooltipContent}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        isVisible={isTooltipVisible}
      />
    </GameContainer>
  );
};
