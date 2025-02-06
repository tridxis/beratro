import { CARD_STYLES } from "@/utils/cardStyles";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";

type TooltipPosition = "top" | "bottom" | "right";

const TooltipContainer = styled(motion.div)<{ position: TooltipPosition }>`
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 0.5vw;
  border-radius: 0.5vw;
  font-size: 0.8vw;
  white-space: pre-wrap;
  z-index: 1000;
  pointer-events: none;
  width: ${CARD_STYLES.container.width};
  height: calc(${CARD_STYLES.container.height} * 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-y: auto;
  box-shadow: 0 0.2vw 1vw rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
`;

interface GlobalTooltipProps {
  content: React.ReactNode | null;
  x: number;
  y: number;
  isVisible: boolean;
  position?: TooltipPosition;
}

export const GlobalTooltip = ({
  content,
  x,
  y,
  isVisible,
  position = "right",
}: GlobalTooltipProps) => {
  return (
    <AnimatePresence>
      {isVisible && content && (
        <TooltipContainer
          position={position}
          initial={{ opacity: 0, x: x - 20, y }}
          animate={{ opacity: 1, x, y }}
          exit={{ opacity: 0, x: x - 20, y }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </TooltipContainer>
      )}
    </AnimatePresence>
  );
};
