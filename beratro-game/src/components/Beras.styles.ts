import { CARD_STYLES } from "@/utils/cardStyles";
import styled from "@emotion/styled";
import Button from "./Button";
import {
  BG_COLOR,
  BLACK_COLOR,
  BLUE_COLOR,
  BORDER_COLOR,
  WHITE_COLOR,
  WOOD_COLOR,
} from "@/utils/colors";

export const BerasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const BerasTitle = styled.h1`
  font-size: 2vw;
  font-weight: bold;
  margin-bottom: 1vw;
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
  margin-bottom: 1vw;
  overflow-x: auto;
`;

export const CardRow = styled.div`
  display: flex;
  gap: 1vw;
  justify-content: center;
`;

export const Card = styled.div<{ isHovered: boolean }>`
  ${CARD_STYLES.container}
  background-color: ${({ isHovered }) =>
    isHovered ? BORDER_COLOR : CARD_STYLES.container.backgroundColor};
  font-size: ${({ isHovered }) => (isHovered ? "0.8vw" : "1vw")};
  color: ${({ isHovered }) => (isHovered ? WHITE_COLOR : BLACK_COLOR)};
  padding: 1vw;
  transition: background-color 0.2s ease-in-out;
`;

export const CardText = styled.p`
  font-weight: 500;
  text-align: center;
`;

export const ContinueButton = styled(Button)`
  width: 10vw;
  margin-top: 1vw;
`;
