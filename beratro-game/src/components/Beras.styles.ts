import { CARD_STYLES } from "@/utils/cardStyles";
import styled from "@emotion/styled";
import Button from "./Button";

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

export const Card = styled.div`
  ${CARD_STYLES.container}
`;

export const CardText = styled.p`
  font-size: 1vw;
  font-weight: 500;
  color: #000;
`;

export const ContinueButton = styled(Button)`
  width: 10vw;
  margin-top: 1vw;
`;
