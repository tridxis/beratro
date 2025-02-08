import { useState } from "react";
import styled from "@emotion/styled";
import { CardPosition } from "@/types/cards";
import { CARD_STYLES } from "@/utils/cardStyles";
import { BORDER_COLOR } from "@/utils/colors";
import { DeckStatsDialog } from "@/components/DeckStatsDialog";
import { AnimatePresence } from "framer-motion";

const DeckContainer = styled.div`
  position: relative;
  width: ${CARD_STYLES.container.width};
  height: ${CARD_STYLES.container.height};
  margin-left: 1vw;
  cursor: pointer;
`;

const DeckCount = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${BORDER_COLOR};
  color: white;
  padding: 0.5vw 1vw;
  border-radius: 0.5vw;
  font-size: 1.2vw;
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  background: ${BORDER_COLOR};
  border-radius: 0.5vw;
  border: 0.15vw solid rgba(0, 0, 0, 0.1);
`;

interface DeckCardsProps {
  deckCards: CardPosition[];
}

export const DeckCards = ({ deckCards }: DeckCardsProps) => {
  const [showStats, setShowStats] = useState(false);

  if (deckCards.length === 0) return null;

  return (
    <>
      <DeckContainer onClick={() => setShowStats(true)}>
        <CardBack />
        <DeckCount>{deckCards.length}</DeckCount>
      </DeckContainer>

      <AnimatePresence>
        {showStats && (
          <DeckStatsDialog
            deckCards={deckCards}
            onClose={() => setShowStats(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
