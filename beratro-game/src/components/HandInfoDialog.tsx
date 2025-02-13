import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { BLACK_COLOR, BORDER_COLOR, WHITE_COLOR } from "@/utils/colors";
import { HAND_NAMES, HandType } from "@/utils/constants";
import Button from "./Button";

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
  width: 40vw;
`;

const Title = styled.h2`
  font-size: 1.5vw;
  margin-bottom: 1vw;
  text-align: center;
`;

const HandItem = styled.div`
  padding: 1vw;
  border-bottom: 0.1vw solid ${BORDER_COLOR}20;

  &:last-child {
    border-bottom: none;
  }
`;

const HandName = styled.div`
  font-size: 1.2vw;
  font-weight: bold;
  margin-bottom: 0.5vw;
`;

const HandExample = styled.div`
  font-size: 0.9vw;
  color: ${BORDER_COLOR};
`;

const Level = styled.span`
  background: ${BORDER_COLOR};
  color: ${WHITE_COLOR};
  padding: 0.2vw 0.4vw;
  border-radius: 0.3vw;
  font-size: 0.8vw;
  margin-left: 0.5vw;
`;

const CloseButton = styled(Button)`
  margin-top: 1vw;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

interface HandInfoDialogProps {
  handLevels: { [key: string]: number };
  onClose: () => void;
}

const HAND_EXAMPLES: Record<HandType, string> = {
  [HandType.FlushFive]: "A♠ K♠ Q♠ J♠ 10♠",
  [HandType.FlushHouse]: "K♠ K♥ K♦ Q♠ Q♥",
  [HandType.FiveOfAKind]: "K♠ K♥ K♦ K♣ K♠",
  [HandType.StraightFlush]: "9♥ 8♥ 7♥ 6♥ 5♥",
  [HandType.FourOfAKind]: "K♠ K♥ K♦ K♣ 2♠",
  [HandType.FullHouse]: "J♠ J♥ J♦ 8♣ 8♠",
  [HandType.Flush]: "A♣ J♣ 8♣ 6♣ 2♣",
  [HandType.Straight]: "Q♠ J♥ 10♦ 9♣ 8♠",
  [HandType.ThreeOfAKind]: "10♠ 10♥ 10♦ 5♣ 2♠",
  [HandType.TwoPair]: "9♠ 9♥ 5♦ 5♣ A♠",
  [HandType.Pair]: "7♠ 7♥ K♦ 4♣ 2♠",
  [HandType.HighCard]: "A♠ K♥ Q♦ J♣ 9♠",
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
                {handLevels[handType] > 1 && (
                  <Level>Level {handLevels[handType]}</Level>
                )}
              </HandName>
              <HandExample>{HAND_EXAMPLES[handType]}</HandExample>
            </HandItem>
          ))}
        <CloseButton onClick={onClose}>Close</CloseButton>
      </Dialog>
    </Overlay>
  );
};
