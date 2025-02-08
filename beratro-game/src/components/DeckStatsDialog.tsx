import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  BG_COLOR,
  BLACK_COLOR,
  BORDER_COLOR,
  RED_COLOR,
  WHITE_COLOR,
  WOOD_COLOR,
} from "@/utils/colors";
import { CardPosition } from "@/types/cards";
import { CardRank, CardSuit, SUIT_SYMBOLS } from "@/utils/constants";
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
  text-align: center;
  color: ${BLACK_COLOR};
`;

const Title = styled.h2`
  font-size: 1.5vw;
  margin-bottom: 1vw;
`;

const Table = styled.table`
  border-collapse: collapse;
  margin: 1vw 0;
`;

const Th = styled.th`
  padding: 0.5vw;
  border: 0.1vw solid ${BORDER_COLOR}10;
  background: rgba(0, 0, 0, 0.05);
  font-size: 1vw;
  width: 3vw;
`;

const Td = styled.td`
  padding: 0.5vw;
  border: 0.1vw solid ${BORDER_COLOR}10;
  font-size: 1vw;
  text-align: center;
  width: 3vw;
`;

const CloseButton = styled(Button)`
  margin-top: 1vw;
`;

interface DeckStatsDialogProps {
  deckCards: CardPosition[];
  onClose: () => void;
}

export const DeckStatsDialog = ({
  deckCards,
  onClose,
}: DeckStatsDialogProps) => {
  // Create a map to store counts
  const cardCounts: Record<string, number> = {};

  // Count cards
  deckCards.forEach((card) => {
    const key = `${card.suit}-${card.rank}`;
    cardCounts[key] = (cardCounts[key] || 0) + 1;
  });

  // Get count for a specific suit and rank
  const getCount = (suit: CardSuit, rank: CardRank) => {
    return cardCounts[`${suit}-${rank}`] || 0;
  };

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
        <Title>Remaining Cards</Title>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              {Object.values(CardRank)
                .reverse()
                .map((rank) => (
                  <Th key={rank}>{rank}</Th>
                ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(CardSuit).map((suit) => (
              <tr key={suit}>
                <Th
                  style={{
                    color:
                      suit === CardSuit.HEARTS || suit === CardSuit.DIAMONDS
                        ? RED_COLOR
                        : BLACK_COLOR,
                  }}
                >
                  {SUIT_SYMBOLS[suit]}
                </Th>
                {Object.values(CardRank).map((rank) => (
                  <Td key={rank}>{getCount(suit, rank)}</Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </Dialog>
    </Overlay>
  );
};
