import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  BLACK_COLOR,
  BORDER_COLOR,
  WHITE_COLOR,
  WOOD_COLOR,
} from "@/utils/colors";
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
  font-size: 2vw;
  margin-bottom: 1vw;
`;

const Text = styled.p`
  font-size: 1.2vw;
  margin-bottom: 2vw;
`;

const RestartButton = styled(Button)`
  background-color: ${WOOD_COLOR};
  color: ${WHITE_COLOR};
  font-size: 1.2vw;
  padding: 0.8vw 2vw;
`;

interface GameOverDialogProps {
  round: number;
  onRestart: () => void;
}

export const GameOverDialog = ({ round, onRestart }: GameOverDialogProps) => {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Dialog
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <Title>Game Over</Title>
        <Text>You made it to Round {round}!</Text>
        <RestartButton onClick={onRestart}>Restart Game</RestartButton>
      </Dialog>
    </Overlay>
  );
};
