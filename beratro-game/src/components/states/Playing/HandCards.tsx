import { motion, AnimatePresence } from "framer-motion";
import {
  HandCardsArea,
  HandContainer,
  ReorderGroup,
  CardSlot,
} from "../../Game.styles";
import { CardPosition } from "@/types/cards";
import DraggableCard from "../../cards/DraggableCard";
import { Breakdown } from "@/types/hands";
import { hoverScaleAnimation, vibrateAnimation } from "@/utils/animations";

interface HandCardsProps {
  handCards: CardPosition[];
  selectedCards: string[];
  currentBreakdown: Breakdown | null;
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
}

export const HandCards = ({
  handCards,
  selectedCards,
  currentBreakdown,
  handleTooltip,
  getCardTooltipContent,
  renderBreakdownCard,
  toggleSelectedCard,
  reorderCards,
}: HandCardsProps) => {
  return (
    <HandCardsArea>
      <HandContainer>
        <ReorderGroup
          axis="x"
          values={handCards.map((card) => card.id)}
          onReorder={(newOrder) => {
            console.log("newOrder", newOrder);
            reorderCards(newOrder as string[]);
          }}
        >
          <AnimatePresence mode="popLayout" initial={true}>
            {handCards.map((card, index) => (
              <CardSlot
                key={card.id}
                index={index}
                totalCards={handCards.length}
              >
                <motion.div
                  style={{
                    position: "relative",
                    transformStyle: "preserve-3d",
                  }}
                  animate={
                    currentBreakdown?.cards.includes(card.id.toString())
                      ? "animate"
                      : "initial"
                  }
                  whileHover="hover"
                  variants={{
                    ...vibrateAnimation,
                    ...hoverScaleAnimation,
                  }}
                >
                  <DraggableCard
                    className="hand-card"
                    card={card}
                    isSelected={selectedCards.includes(card.id)}
                    onSelect={(id) => {
                      if (!selectedCards.includes(id)) {
                        if (selectedCards.length >= 5) return;
                      }
                      toggleSelectedCard(id);
                    }}
                    onMouseEnter={(e) => {
                      const content = getCardTooltipContent(card);
                      if (content) handleTooltip(true, content, e, "top");
                    }}
                    onMouseLeave={() => handleTooltip(false)}
                  />
                </motion.div>
                {renderBreakdownCard(card)}
              </CardSlot>
            ))}
          </AnimatePresence>
        </ReorderGroup>
      </HandContainer>
    </HandCardsArea>
  );
};
