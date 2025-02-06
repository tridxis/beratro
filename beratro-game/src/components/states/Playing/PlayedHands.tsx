import { motion } from "framer-motion";
import {
  PlayedHandArea,
  PlayedHandContainer,
  CardRow,
} from "../../Game.styles";
import { CardPosition } from "@/types/cards";
import { DisplayCard } from "../../cards/DisplayCard";
import { Breakdown } from "@/types/hands";
import { hoverScaleAnimation, vibrateAnimation } from "@/utils/animations";

interface PlayedHandsProps {
  playedHands: CardPosition[][];
  lastPlayedIndex: number | null;
  currentBreakdown: Breakdown | null;
  handleTooltip: (
    show: boolean,
    content?: React.ReactNode,
    event?: React.MouseEvent,
    position?: "top" | "bottom" | "right"
  ) => void;
  getCardTooltipContent: (card: CardPosition) => React.ReactNode;
  renderBreakdownCard: (card: CardPosition) => React.ReactNode;
}

export const PlayedHands = ({
  playedHands,
  lastPlayedIndex,
  currentBreakdown,
  handleTooltip,
  getCardTooltipContent,
  renderBreakdownCard,
}: PlayedHandsProps) => {
  return (
    <PlayedHandArea>
      {playedHands.map((hand, handIndex) => (
        <PlayedHandContainer
          key={handIndex}
          isLastPlayed={handIndex === lastPlayedIndex}
        >
          <CardRow isLastPlayed={handIndex === lastPlayedIndex}>
            {hand.map((card, index) => (
              <div
                key={card.id}
                style={{
                  position: "relative",
                  marginRight: "1vw",
                }}
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
                  <DisplayCard
                    card={card}
                    onMouseEnter={(e) => {
                      const content = getCardTooltipContent(card);
                      if (content) handleTooltip(true, content, e, "top");
                    }}
                    onMouseLeave={() => handleTooltip(false)}
                  />
                </motion.div>
                {renderBreakdownCard(card)}
              </div>
            ))}
          </CardRow>
        </PlayedHandContainer>
      ))}
    </PlayedHandArea>
  );
};
