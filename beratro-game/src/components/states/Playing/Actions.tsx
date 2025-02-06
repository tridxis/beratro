import React from "react";
import {
  ActionButtonsContainer,
  ActionButtonGroup,
  ActionButton,
  SortButton,
} from "../../Game.styles";
import { CardPosition } from "@/types/cards";

interface ActionsProps {
  selectedCards: string[];
  playedHands: CardPosition[][];
  maxHands: number;
  handleAction: (action: "play" | "discard") => void;
  sortByValue: () => void;
  sortBySuit: () => void;
  discards: CardPosition[][];
  maxDiscards: number;
}

const Actions = ({
  selectedCards,
  playedHands,
  maxHands,
  handleAction,
  sortByValue,
  sortBySuit,
  discards,
  maxDiscards,
}: ActionsProps) => {
  return (
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
  );
};

export default Actions;
