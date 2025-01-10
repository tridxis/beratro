import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { DisplayCard } from "./cards/DisplayCard";
import DraggableCard from "./cards/DraggableCard";
import { Calculator } from "@/utils/calculator";
import { HandType } from "@/utils/constants";
import { PokerHand } from "@/types/hands";
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
  BigBlindBox,
  BigBlindHeader,
  BigBlindContent,
  BigBlindTarget,
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
  ItemContainer,
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
} from "./Game.styles";
import { BLUE_COLOR, GOLD_COLOR, RED_COLOR } from "@/utils/colors";

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
    maxHands,
    maxDiscards,
    currentState,
    setCurrentState,
  } = useGameStore();

  const [lastPlayedIndex, setLastPlayedIndex] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [cardScores, setCardScores] = useState<{
    [key: number]: {
      chips: number[];
      mults: number[];
    };
  }>({});

  const pokerHandRef = useRef<PokerHand | null>(null);

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

      // Calculate score for the played hand
      const playedCards = selectedCards
        .map((id) => handCards.find((card) => card.id === id)!)
        .sort((a, b) => a.index - b.index);

      console;

      const { score, scoredCards, pokerHand } =
        Calculator.calculateScore(playedCards);

      // Animate individual card scores
      playedCards.forEach((card, index) => {
        if (scoredCards[index]) {
          setTimeout(() => {
            setCardScores((prev) => ({
              ...prev,
              [scoredCards[index].id]: {
                chips: scoredCards[index].chips,
                mults: scoredCards[index].mults,
              },
            }));
          }, index * 360); // Show each card's score 200ms apart
        }
      });

      pokerHandRef.current = pokerHand;

      // Update total score after all individual scores are shown
      setTimeout(() => {
        setCurrentScore(score);
        addScore(score);

        setCardScores({});
        // Clear individual scores and reset display after 5s
        setTimeout(() => {
          setCurrentScore(null);
          setLastPlayedIndex(null);
          pokerHandRef.current = null;
          if (score >= 1) {
            setCurrentState(GameState.ROUND_ENDED);
          }
        }, playedCards.length * (scoredCards[0].chips.length + scoredCards[0].mults.length) * 360 + 360);
      }, playedCards.length * 360 + 360); // Wait for all card scores to show

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
    const rounded = useTransform(count, (latest) => Math.round(latest));

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
            <BigBlindHeader>BIG BLIND</BigBlindHeader>
            <BigBlindContent>
              <FlexRow style={{ justifyContent: "space-between" }}>
                <div>
                  <div>Score at least</div>
                  <BigBlindTarget>450</BigBlindTarget>
                </div>
                <div>to earn $$$$</div>
              </FlexRow>
            </BigBlindContent>
          </BentoBox>

          <BentoBox style={{ padding: "1vw" }}>
            <div>Round score</div>
            <ScoreValue>{score}</ScoreValue>
          </BentoBox>

          <HandScoreContainer>
            <HandTypeText>{pokerHandRef.current?.handType}</HandTypeText>
            <ScoreDisplay>
              <ChipsDisplay>
                {useAnimatedCounter(
                  (pokerHandRef.current?.chips || 0) +
                    Object.keys(cardScores).reduce(
                      (sum: number, card: string) =>
                        sum +
                        cardScores[Number(card)].chips.reduce(
                          (sum: number, chip: number) => sum + chip,
                          0
                        ),
                      0
                    )
                )}
              </ChipsDisplay>
              <span style={{ fontSize: "2vw" }}>×</span>
              <MultiplierDisplay>
                {pokerHandRef.current?.mult || 0}
              </MultiplierDisplay>
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
              <StatValue color={GOLD_COLOR}>
                {maxDiscards - discards.length}
              </StatValue>
            </StatBox>
          </StatsGrid>
        </LeftPanel>
      </LeftArea>

      <MainGameArea>
        <DeckAreaContainer>
          <DeckSection>Beras Here!</DeckSection>
          <MemesSection>Memes Here!</MemesSection>
        </DeckAreaContainer>

        {currentState === GameState.SHOPPING && (
          <ShopContainer>
            <ShopButtonGrid>
              <ShopButton
                variant="primary"
                onClick={() => setCurrentState(GameState.PLAYING)}
              >
                Next Round
              </ShopButton>
              <ShopButton variant="secondary">Reroll $5</ShopButton>
            </ShopButtonGrid>

            <ShopItemsGrid>
              {[
                { name: "Joker #1", price: "$3" },
                { name: "Joker #8", price: "$7" },
                { name: "Joker #12", price: "$10" },
                { name: "Memes Pack", price: "$4" },
                { name: "Super Memes Pack", price: "$8" },
              ].map((item, index) => (
                <ShopItem key={index}>
                  <PriceTag>{item.price}</PriceTag>
                  <ItemContainer>{item.name}</ItemContainer>
                </ShopItem>
              ))}
            </ShopItemsGrid>
          </ShopContainer>
        )}

        {currentState === GameState.ROUND_ENDED && (
          <RoundEndContainer>
            <CashOutButton onClick={() => setCurrentState(GameState.SHOPPING)}>
              Cash Out: $42
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
                        {cardScores[card.id] && (
                          <ScorePopup
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {cardScores[card.id].chips.map((chip, i) => (
                              <ChipScore key={i}>+{chip}</ChipScore>
                            ))}
                            {cardScores[card.id].mults.map((mult, i) => (
                              <MultScore key={i}>×{mult}</MultScore>
                            ))}
                          </ScorePopup>
                        )}
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
                          onSelect={toggleSelectedCard}
                        />
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
