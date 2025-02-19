import {
  BLACK_COLOR,
  BORDER_COLOR,
  GRAY_COLOR,
  WHITE_COLOR,
  WOOD_COLOR,
} from "@/utils/colors";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const Button = styled(motion.button)`
  border: 0.15vw solid ${BORDER_COLOR};
  border-radius: 1vw;
  padding: 0.75vw;
  background-color: ${WOOD_COLOR};
  color: ${WHITE_COLOR};
  font-weight: bold;
  font-size: 1vw;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0);
  transition: all 0.2s ease;
  transform: scale(1);

  &:hover:not(:disabled) {
    transform: translateY(1px) scale(1.02);
    box-shadow: inset 0 -0.3vw 0 rgba(0, 0, 0, 0.3);
    padding-top: 0.6vw;
    padding-bottom: 0.9vw;
  }

  &:active:not(:disabled) {
    transform: translateY(1px) scale(1.02);
    padding-top: 0.65vw;
    padding-bottom: 0.85vw;
    box-shadow: inset 0 -0.2vw 0 rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background-color: ${GRAY_COLOR};
    border: none;
    cursor: not-allowed;
  }
`;

export default Button;
