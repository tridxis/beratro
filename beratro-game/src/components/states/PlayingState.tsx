import { CardPosition } from "@/types/cards";
import { Breakdown } from "@/types/hands";
import { PlayedHands } from "./Playing/PlayedHands";
import { HandCards } from "./Playing/HandCards";
import Actions from "./Playing/Actions";

interface PlayingStateProps {
  handCards: CardPosition[];
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
