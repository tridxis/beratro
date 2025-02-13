import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  BLACK_COLOR,
  BORDER_COLOR,
  WHITE_COLOR,
  BLUE_COLOR,
  RED_COLOR,
} from "@/utils/colors";
import {
  HAND_NAMES,
  HandType,
  CardRank,
  CardSuit,
  HAND_VALUES,
} from "@/utils/constants";
import Button from "./Button";
import { DisplayCard } from "./cards/DisplayCard";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Dialog = styled(motion.div)`
  background: ${WHITE_COLOR};
  padding: 2vw;
  border-radius: 1vw;
  text-align: left;
  color: ${BLACK_COLOR};
  max-height: 80vh;
  overflow-y: auto;
  width: 60vw;
`;

const Title = styled.h2`
  font-size: 1.5vw;
  margin-bottom: 1vw;
  text-align: center;
`;

const HandItem = styled.div`
  border-bottom: 0.1vw solid ${BORDER_COLOR}20;
  display: grid;
  grid-template-columns: 20vw 8vw 22vw;
  align-items: center;
  gap: 2vw;
  &:last-child {
    border-bottom: none;
  }
`;

const HandName = styled.div`
  font-size: 1.4vw;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const HandStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3vw;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5vw;
`;

const StatLabel = styled.span`
  color: ${BORDER_COLOR};
  font-size: 1.2vw;
`;

const StatValue = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-weight: bold;
  font-size: 1.2vw;
`;

const Level = styled.span`
  background: ${BORDER_COLOR};
  color: ${WHITE_COLOR};
  padding: 0.3vw 0.6vw;
  border-radius: 0.3vw;
  font-size: 1vw;
  margin-left: 0.8vw;
  font-weight: normal;
  display: inline-block;
`;

const CloseButton = styled(Button)`
  margin-top: 1vw;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const CardWrapper = styled.div`
  position: relative;
  cursor: default;
  &:hover {
    transform: none;
  }
`;

const HandExample = styled.div`
  display: flex;
  gap: 0.5vw;
  transform: scale(0.5);
  transform-origin: left center;
  margin: 0vw 0;
  flex: 1;
`;

interface HandInfoDialogProps {
  handLevels: { [key: string]: number };
  onClose: () => void;
}

const HAND_EXAMPLES: Record<
  HandType,
  Array<{ rank: CardRank; suit: CardSuit }>
> = {
  [HandType.FlushFive]: [
    { rank: CardRank.ACE, suit: CardSuit.SPADES },
    { rank: CardRank.ACE, suit: CardSuit.SPADES },
    { rank: CardRank.ACE, suit: CardSuit.SPADES },
    { rank: CardRank.ACE, suit: CardSuit.SPADES },
    { rank: CardRank.ACE, suit: CardSuit.SPADES },
  ],
  [HandType.FlushHouse]: [
    { rank: CardRank.KING, suit: CardSuit.DIAMONDS },
    { rank: CardRank.KING, suit: CardSuit.DIAMONDS },
    { rank: CardRank.KING, suit: CardSuit.DIAMONDS },
    { rank: CardRank.QUEEN, suit: CardSuit.DIAMONDS },
    { rank: CardRank.QUEEN, suit: CardSuit.DIAMONDS },
  ],
  [HandType.FiveOfAKind]: [
    { rank: CardRank.KING, suit: CardSuit.SPADES },
    { rank: CardRank.KING, suit: CardSuit.HEARTS },
    { rank: CardRank.KING, suit: CardSuit.DIAMONDS },
    { rank: CardRank.KING, suit: CardSuit.CLUBS },
    { rank: CardRank.KING, suit: CardSuit.HEARTS },
  ],
  [HandType.StraightFlush]: [
    { rank: CardRank.NINE, suit: CardSuit.HEARTS },
    { rank: CardRank.EIGHT, suit: CardSuit.HEARTS },
    { rank: CardRank.SEVEN, suit: CardSuit.HEARTS },
    { rank: CardRank.SIX, suit: CardSuit.HEARTS },
    { rank: CardRank.FIVE, suit: CardSuit.HEARTS },
  ],
  [HandType.FourOfAKind]: [
    { rank: CardRank.KING, suit: CardSuit.SPADES },
    { rank: CardRank.KING, suit: CardSuit.HEARTS },
    { rank: CardRank.KING, suit: CardSuit.DIAMONDS },
    { rank: CardRank.KING, suit: CardSuit.CLUBS },
    { rank: CardRank.TWO, suit: CardSuit.SPADES },
  ],
  [HandType.FullHouse]: [
    { rank: CardRank.JACK, suit: CardSuit.SPADES },
    { rank: CardRank.JACK, suit: CardSuit.HEARTS },
    { rank: CardRank.JACK, suit: CardSuit.DIAMONDS },
    { rank: CardRank.EIGHT, suit: CardSuit.CLUBS },
    { rank: CardRank.EIGHT, suit: CardSuit.SPADES },
  ],
  [HandType.Flush]: [
    { rank: CardRank.ACE, suit: CardSuit.CLUBS },
    { rank: CardRank.JACK, suit: CardSuit.CLUBS },
    { rank: CardRank.EIGHT, suit: CardSuit.CLUBS },
    { rank: CardRank.SIX, suit: CardSuit.CLUBS },
    { rank: CardRank.TWO, suit: CardSuit.CLUBS },
  ],
  [HandType.Straight]: [
    { rank: CardRank.QUEEN, suit: CardSuit.HEARTS },
    { rank: CardRank.JACK, suit: CardSuit.HEARTS },
    { rank: CardRank.TEN, suit: CardSuit.DIAMONDS },
    { rank: CardRank.NINE, suit: CardSuit.CLUBS },
    { rank: CardRank.EIGHT, suit: CardSuit.SPADES },
  ],
  [HandType.ThreeOfAKind]: [
    { rank: CardRank.TEN, suit: CardSuit.SPADES },
    { rank: CardRank.TEN, suit: CardSuit.HEARTS },
    { rank: CardRank.TEN, suit: CardSuit.DIAMONDS },
    { rank: CardRank.FIVE, suit: CardSuit.CLUBS },
    { rank: CardRank.TWO, suit: CardSuit.SPADES },
  ],
  [HandType.TwoPair]: [
    { rank: CardRank.NINE, suit: CardSuit.SPADES },
    { rank: CardRank.NINE, suit: CardSuit.HEARTS },
    { rank: CardRank.FIVE, suit: CardSuit.DIAMONDS },
    { rank: CardRank.FIVE, suit: CardSuit.CLUBS },
    { rank: CardRank.ACE, suit: CardSuit.SPADES },
  ],
  [HandType.Pair]: [
    { rank: CardRank.SEVEN, suit: CardSuit.SPADES },
    { rank: CardRank.SEVEN, suit: CardSuit.HEARTS },
    { rank: CardRank.KING, suit: CardSuit.DIAMONDS },
    { rank: CardRank.FOUR, suit: CardSuit.CLUBS },
    { rank: CardRank.TWO, suit: CardSuit.SPADES },
  ],
  [HandType.HighCard]: [
    { rank: CardRank.ACE, suit: CardSuit.SPADES },
    { rank: CardRank.KING, suit: CardSuit.HEARTS },
    { rank: CardRank.QUEEN, suit: CardSuit.DIAMONDS },
    { rank: CardRank.JACK, suit: CardSuit.CLUBS },
    { rank: CardRank.NINE, suit: CardSuit.SPADES },
  ],
};

export const HandInfoDialog = ({
  handLevels,
  onClose,
}: HandInfoDialogProps) => {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Dialog
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title>Hand Types</Title>
        {Object.values(HandType)
          .reverse()
          .map((handType) => (
            <HandItem key={handType}>
              <HandName>
                {HAND_NAMES[handType]}
                {(handLevels[handType] ?? 1) >= 1 && (
                  <Level>Level {handLevels[handType] ?? 1}</Level>
                )}
              </HandName>

              <HandStats>
                <StatRow>
                  <StatValue color={BLUE_COLOR}>
                    {HAND_VALUES[handType].chips +
                      ((handLevels[handType] || 1) - 1) *
                        HAND_VALUES[handType].chipsLvl}
                  </StatValue>
                  <StatLabel>chips</StatLabel>
                </StatRow>
                <StatRow>
                  <StatValue color={RED_COLOR}>
                    {HAND_VALUES[handType].mult +
                      ((handLevels[handType] || 1) - 1) *
                        HAND_VALUES[handType].multLvl}
                  </StatValue>
                  <StatLabel>mult</StatLabel>
                </StatRow>
              </HandStats>

              <HandExample>
                {HAND_EXAMPLES[handType].map((card, index) => (
                  <CardWrapper key={index}>
                    <DisplayCard
                      card={{
                        id: `example-${index}`,
                        rank: card.rank,
                        suit: card.suit,
                        index,
                      }}
                    />
                  </CardWrapper>
                ))}
              </HandExample>
            </HandItem>
          ))}
        <CloseButton onClick={onClose}>Close</CloseButton>
      </Dialog>
    </Overlay>
  );
};
