import { BORDER_COLOR, WHITE_COLOR, WOOD_COLOR } from "@/utils/colors";
import styled from "@emotion/styled";

const Button = styled.button`
  border: 0.15vw solid ${BORDER_COLOR};
  border-radius: 1vw;
  padding: 0.75vw;
  background-color: ${WOOD_COLOR};
  color: ${WHITE_COLOR};
  font-weight: bold;
  font-size: 1vw;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0);
  transition: all 0.1s ease;
  &:hover:not(:disabled) {
    transform: translateY(1px);
    box-shadow: inset 0 -0.3vw 0 rgba(0, 0, 0, 0.3);
    padding-top: 0.6vw;
    padding-bottom: 0.9vw;
  }

  &:active:not(:disabled) {
    padding-top: 0.65vw;
    padding-bottom: 0.85vw;
    box-shadow: inset 0 -0.2vw 0 rgba(0, 0, 0, 0.3);
  }
`;

export default Button;
