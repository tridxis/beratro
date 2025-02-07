import { useEffect, useRef, useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { Calculator } from "@/utils/calculator";
import {
  ANIMATION_MS,
  Flower,
  GameAction,
  HandType,
  Sticker,
  Unit,
} from "@/utils/constants";
import { Breakdown, PokerHand } from "@/types/hands";
import { GameState } from "@/types/games";
import {
  FlexRow,
  GameContainer,
  LeftPanel,
  ResetButton,
  RoundHeader,
  RoundContent,
  ScoreTarget,
  MainGameArea,
  DeckAreaContainer,
  ScorePopup,
  ChipScore,
  MultScore,
  LeftArea,
  BentoBox,
  RetriggerScore,
  GoldScore,
} from "./Game.styles";
import { BLUE_COLOR } from "@/utils/colors";
import { BoosterPosition, CardPosition } from "@/types/cards";
import { BERA_STATS, BeraType } from "@/utils/beraStats";
import useCalculator from "@/hooks/useCalculator";
import { BeraPosition } from "@/types/beras";
import { STICKER_STATS } from "@/utils/stickerStats";
import { motion } from "framer-motion";
import { GlobalTooltip } from "./Tooltip";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { RoundEndedState } from "./states/RoundEndedState";
import { ShoppingState } from "./states/ShoppingState";
import { PlayingState } from "./states/PlayingState";
import BeraArea from "./BeraArea";
import BoosterArea from "./BoosterArea";
import { Score } from "./Score";
import Stats from "./Stats";
import { vibrateAnimation } from "@/utils/animations";

// Update the hover scale animation to maintain z-index

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
    setSelectedBeras,
    modifyGold,
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
  const [upgradingHand, setUpgradingHand] = useState<HandType>();

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
        setSelectedBeras([]);
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

          <Score
            score={score}
            pokerHand={pokerHand}
            upgradingHand={upgradingHand}
            handLevels={handLevels}
            currentBreakdown={currentBreakdown}
            previewPokerHand={previewPokerHand}
          />

          <Stats
            maxHands={maxHands}
            playedHands={playedHands}
            maxDiscards={maxDiscards}
            discards={discards}
            gold={gold}
          />
        </LeftPanel>
      </LeftArea>

      <MainGameArea>
        <DeckAreaContainer>
          <BeraArea
            state={state}
            handleTooltip={handleTooltip}
            currentBreakdown={currentBreakdown}
            renderBreakdownBera={renderBreakdownBera}
            sellBera={sellBera}
          />
          <BoosterArea
            boosters={boosters}
            selectedBooster={selectedBooster}
            setSelectedBooster={setSelectedBooster}
            handleActivateBooster={handleActivateBooster}
            sellBooster={sellBooster}
            handleTooltip={handleTooltip}
          />
        </DeckAreaContainer>

        {currentState === GameState.SHOPPING && (
          <ShoppingState
            selectedPack={selectedPack}
            shopBeras={shopBeras}
            gold={gold}
            boughtPacks={boughtPacks}
            handleTooltip={handleTooltip}
            getCardTooltipContent={getCardTooltipContent}
            buyBera={buyBera}
            buyPack={buyPack}
            pickItemFromPack={pickItemFromPack}
            nextRound={nextRound}
            dealCards={dealCards}
            skipPack={skipPack}
          />
        )}

        {currentState === GameState.ROUND_ENDED && (
          <RoundEndedState
            reqScore={reqScore}
            roundGold={roundGold}
            maxHands={maxHands}
            playedHands={playedHands}
            gold={gold}
            bonusGolds={bonusGolds}
            goldEarned={goldEarned}
            endRound={endRound}
            setBonusGolds={setBonusGolds}
          />
        )}

        {currentState === GameState.PLAYING && (
          <PlayingState
            handCards={handCards}
            selectedCards={selectedCards}
            playedHands={playedHands}
            lastPlayedIndex={lastPlayedIndex}
            currentBreakdown={currentBreakdown}
            maxHands={maxHands}
            maxDiscards={maxDiscards}
            discards={discards}
            handleTooltip={handleTooltip}
            getCardTooltipContent={getCardTooltipContent}
            renderBreakdownCard={renderBreakdownCard}
            toggleSelectedCard={toggleSelectedCard}
            reorderCards={reorderCards}
            handleAction={handleAction}
            sortByValue={sortByValue}
            sortBySuit={sortBySuit}
          />
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
