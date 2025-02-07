import styled from "@emotion/styled";
import { DARK_GOLD_COLOR } from "@/utils/colors";

const StarsContainer = styled.div`
  display: flex;
  gap: 0.2vw;
  margin-top: 0.2vw;
`;

const Star = styled.div<{ filled: boolean }>`
  color: ${(props) => (props.filled ? DARK_GOLD_COLOR : "rgba(0, 0, 0, 0.2)")};
  font-size: 1.2vw;
`;

interface StarsProps {
  level: number;
  maxLevel?: number;
}

export const Stars = ({ level, maxLevel = 3 }: StarsProps) => {
  return (
    <StarsContainer>
      {Array.from({ length: maxLevel }, (_, i) => (
        <Star key={i} filled={i < level}>
          ★
        </Star>
      ))}
    </StarsContainer>
  );
};
