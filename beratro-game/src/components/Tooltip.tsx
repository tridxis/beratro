import { CARD_STYLES } from "@/utils/cardStyles";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";

const TooltipContainer = styled(motion.div)`
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 1vw;
  border-radius: 0.5vw;
  font-size: 0.8vw;
  white-space: pre-wrap;
  z-index: 1000;
  pointer-events: none;
  width: ${CARD_STYLES.container.width};
  height: ${CARD_STYLES.container.height};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-y: auto;
  box-shadow: 0 0.2vw 1vw rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);

  &::after {
    content: "";
    position: absolute;
    right: -1vw;
    top: 50%;
    transform: translateY(-50%);
    border-width: 1vw 0 1vw 1vw;
    border-style: solid;
    border-color: transparent transparent transparent rgba(0, 0, 0, 0.85);
    pointer-events: none;
    z-index: 1000;
  }
`;

interface GlobalTooltipProps {
  content: React.ReactNode | null;
  x: number;
  y: number;
  isVisible: boolean;
}

export const GlobalTooltip = ({
  content,
  x,
  y,
  isVisible,
}: GlobalTooltipProps) => {
  return (
    <AnimatePresence>
      {isVisible && content && (
        <TooltipContainer
          initial={{ opacity: 0, x: x - 20, y }}
          animate={{ opacity: 1, x: x, y }}
          exit={{ opacity: 0, x: x - 20, y }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </TooltipContainer>
      )}
    </AnimatePresence>
  );
};
