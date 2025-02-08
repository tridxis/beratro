import { CardPosition } from "@/types/cards";
import { Breakdown } from "@/types/hands";
import { PlayedHands } from "./Playing/PlayedHands";
import { HandCards } from "./Playing/HandCards";
import { DeckCards } from "./Playing/DeckCards";
import Actions from "./Playing/Actions";
import styled from "@emotion/styled";

const HandArea = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 1vw 0;
`;

interface PlayingStateProps {
  handCards: CardPosition[];
  deckCards: CardPosition[];
  selectedCards: string[];
  playedHands: CardPosition[][];
  lastPlayedIndex: number | null;
  currentBreakdown: Breakdown | null;
  maxHands: number;
  maxDiscards: number;
  discards: CardPosition[][];
  handleTooltip: (
    show: boolean,
    content?: React.ReactNode,
    event?: React.MouseEvent,
    position?: "top" | "bottom" | "right"
  ) => void;
  getCardTooltipContent: (card: CardPosition) => React.ReactNode;
  renderBreakdownCard: (card: CardPosition) => React.ReactNode;
  toggleSelectedCard: (id: string) => void;
  reorderCards: (newOrder: string[]) => void;
  handleAction: (action: "play" | "discard") => void;
  sortByValue: () => void;
  sortBySuit: () => void;
}

export const PlayingState = ({
  handCards,
  deckCards,
  selectedCards,
  playedHands,
  lastPlayedIndex,
  currentBreakdown,
  maxHands,
  maxDiscards,
  discards,
  handleTooltip,
  getCardTooltipContent,
  renderBreakdownCard,
  toggleSelectedCard,
  reorderCards,
  handleAction,
  sortByValue,
  sortBySuit,
}: PlayingStateProps) => {
  return (
    <>
      <PlayedHands
        playedHands={playedHands}
        lastPlayedIndex={lastPlayedIndex}
        currentBreakdown={currentBreakdown}
        handleTooltip={handleTooltip}
        getCardTooltipContent={getCardTooltipContent}
        renderBreakdownCard={renderBreakdownCard}
      />

      <HandArea>
        <HandCards
          handCards={handCards}
          selectedCards={selectedCards}
          currentBreakdown={currentBreakdown}
          handleTooltip={handleTooltip}
          getCardTooltipContent={getCardTooltipContent}
          renderBreakdownCard={renderBreakdownCard}
          toggleSelectedCard={toggleSelectedCard}
          reorderCards={reorderCards}
        />
        <DeckCards deckCards={deckCards} />
      </HandArea>

      <Actions
        selectedCards={selectedCards}
        playedHands={playedHands}
        maxHands={maxHands}
        handleAction={handleAction}
        sortByValue={sortByValue}
        sortBySuit={sortBySuit}
        discards={discards}
        maxDiscards={maxDiscards}
      />
    </>
  );
};
