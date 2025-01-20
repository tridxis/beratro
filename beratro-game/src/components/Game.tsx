import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { DisplayCard } from "./cards/DisplayCard";
import DraggableCard from "./cards/DraggableCard";
import { Calculator } from "@/utils/calculator";
import { ANIMATION_MS, Bera, HandType, Unit } from "@/utils/constants";
import { Breakdown, PokerHand } from "@/types/hands";
import { useMotionValue, useTransform, animate } from "framer-motion";
import { GameState } from "@/types/games";
import {
  RoundEndContainer,
  CashOutButton,
  FlexRow,
  CircleIcon,
  SquareIcon,
  Separator,
  RewardText,
  ScoreText,
  GameContainer,
  LeftPanel,
  ResetButton,
  RoundHeader,
  RoundContent,
  ScoreTarget,
  ScoreBox,
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
} from "./Game.styles";
import { BLUE_COLOR, GOLD_COLOR, RED_COLOR } from "@/utils/colors";
import { CardPosition } from "@/types/cards";
import { AnimatedValueDisplay } from "./AnimatedValueDisplay";
import { BERA_STATS } from "@/utils/beraStats";
import useCalculator from "@/hooks/useCalculator";
import { BeraPosition } from "@/types/beras";

export const Game = () => {
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
    removedCards,
    maxHands,
    maxDiscards,
    currentState,
    round,
    reqScore,
    setCurrentState,
    endRound,
    shopBeras,
    buyBera,
    playingBeras,
    gold,
    nextRound,
  } = useGameStore();

  const { play } = useCalculator();

  const [lastPlayedIndex, setLastPlayedIndex] = useState<number | null>(null);

  const pokerHandRef = useRef<PokerHand | null>(null);

  // Add state for current breakdown at component level
  const [currentBreakdown, setCurrentBreakdown] = useState<Breakdown | null>(
    null
  );

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

  const handleAction = (action: "play" | "discard") => {
    if (action === "play") {
      if (playedHands.length >= maxHands) {
        alert(`Maximum of ${maxHands} played hands reached!`);
        return;
      }
      playSelectedCards();

      const {
        score: currentScore,
        pokerHand,
        playingBreakdowns,
        inHandBreakdowns,
      } = play();
      console.log(playingBreakdowns);
      console.log(inHandBreakdowns);

      pokerHandRef.current = pokerHand;

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
            if (score >= reqScore) {
              setCurrentState(GameState.ROUND_ENDED);
            }
          }, ANIMATION_MS * 3);
        }
      }, ANIMATION_MS);

      setLastPlayedIndex(playedHands.length);
    } else {
      if (discards.length >= maxDiscards) {
        alert(`Maximum of ${maxDiscards} discards reached!`);
        return;
      }
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
      (unit !== Unit.CHIPS && unit !== Unit.MULT && unit !== Unit.X_MULT)
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
        transition={{ duration: ANIMATION_MS / 3000 }}
      >
        {unit === Unit.CHIPS && <ChipScore>+{value}</ChipScore>}
        {(unit === Unit.MULT || unit === Unit.X_MULT) && (
          <MultScore>
            {unit === Unit.X_MULT ? "×" : "+"}
            {value}
          </MultScore>
        )}
      </ScorePopup>
    );
  };

  const renderBreakdownCard = (card: CardPosition) => {
    if (!currentBreakdown) return <></>;
    return renderBreakdownScore(
      card.id.toString(),
      "card",
      currentBreakdown.cards.map((card) => card.toString()),
      currentBreakdown.values,
      currentBreakdown.units
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
            <HandTypeText>
              {pokerHandRef.current?.handType || previewPokerHand?.handType}
            </HandTypeText>
            <ScoreDisplay>
              <ChipsDisplay
                value={currentBreakdown?.chips || previewPokerHand?.chips || 0}
              />
              <span style={{ fontSize: "2vw" }}>×</span>
              <MultiplierDisplay
                value={currentBreakdown?.mult || previewPokerHand?.mult || 0}
              />
            </ScoreDisplay>
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
                <ShopItem key={`playing-bera-${index}`}>
                  {BERA_STATS[bera.bera].name}
                  <span>
                    {BERA_STATS[bera.bera].description.replace(
                      "{{value}}",
                      BERA_STATS[bera.bera].values[0].toString()
                    )}
                  </span>
                  {renderBreakdownBera(bera)}
                </ShopItem>
              ))}
            </DeckContainer>
            <DeckDescription>{playingBeras.length}/5</DeckDescription>
          </DeckSection>
          <MemesSection>
            <DeckContainer>Memes Here!</DeckContainer>
            <DeckDescription>0/2</DeckDescription>
          </MemesSection>
        </DeckAreaContainer>

        {currentState === GameState.SHOPPING && (
          <ShopContainer>
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
                    <ShopItem key={`pack-${index}`}>
                      <PriceTag>${BERA_STATS[bera.bera].cost}</PriceTag>
                      {BERA_STATS[bera.bera].name}
                      <span>
                        {BERA_STATS[bera.bera].description.replace(
                          "{{value}}",
                          BERA_STATS[bera.bera].values[0].toString()
                        )}
                      </span>
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
                  {[
                    { name: "Basic Pack", price: "$4" },
                    { name: "Premium Pack", price: "$8" },
                    { name: "Ultra Pack", price: "$12" },
                  ].map((item, index) => (
                    <ShopItem key={`pack-${index}`}>
                      <PriceTag>{item.price}</PriceTag>
                      {item.name}
                    </ShopItem>
                  ))}
                </ShopItemGrid>
              </ShopSection>
            </ShopItemsGrid>
          </ShopContainer>
        )}

        {currentState === GameState.ROUND_ENDED && (
          <RoundEndContainer>
            <CashOutButton onClick={() => endRound(5)}>
              Cash Out: $5
            </CashOutButton>

            <FlexRow>
              <CircleIcon>A</CircleIcon>
              <ScoreText>12,000</ScoreText>
              <RewardText>$$$$$</RewardText>
            </FlexRow>

            <Separator />

            <FlexRow>
              <span style={{ marginRight: "10px" }}>3</span>
              <span>Remaining Hands ($1 each)</span>
              <RewardText>$$$</RewardText>
            </FlexRow>

            {[1, 2].map((_, index) => (
              <FlexRow key={index}>
                <SquareIcon>S</SquareIcon>
                <span>Defeat the Boss Blind</span>
                <RewardText>$$$$$$$$$$$$$$$</RewardText>
              </FlexRow>
            ))}

            <FlexRow>
              <span style={{ marginRight: "10px" }}>4</span>
              <span>1 Interest per $5 (5 max)</span>
              <RewardText>$$$$</RewardText>
            </FlexRow>
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
                      <CardWrapper key={card.id} index={index}>
                        <DisplayCard card={card} />
                        {renderBreakdownCard(card)}
                      </CardWrapper>
                    ))}
                  </CardRow>
                </PlayedHandContainer>
              ))}
            </PlayedHandArea>

            <HandCardsArea>
              <HandContainer>
                <ReorderGroup
                  axis="x"
                  values={handCards.map((card) => card.index)}
                  onReorder={(newOrder) => reorderCards(newOrder as number[])}
                >
                  <AnimatePresence mode="popLayout" initial={true}>
                    {handCards.map((card, index) => (
                      <CardSlot
                        key={card.id}
                        index={index}
                        totalCards={handCards.length}
                      >
                        <DraggableCard
                          className="hand-card"
                          card={card}
                          isSelected={selectedCards.includes(card.id)}
                          onSelect={(id) => {
                            if (!selectedCards.includes(id)) {
                              if (selectedCards.length >= 5) {
                                return;
                              }
                            }
                            toggleSelectedCard(id);
                          }}
                        />
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
                    onClick={() => handleAction("discard")}
                  >
                    DISCARD
                  </ActionButton>
                </ActionButtonGroup>
              )}
            </ActionButtonsContainer>
          </>
        )}
      </MainGameArea>
    </GameContainer>
  );
};
