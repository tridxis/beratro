import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Reorder } from "framer-motion";

export const RoundEndContainer = styled.div`
  padding: 20px;
  background-color: #1e2a38;
  border-radius: 8px;
  margin-top: 20px;
  color: white;
`;

export const CashOutButton = styled.button`
  background-color: #8b4513;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const IconBase = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const CircleIcon = styled(IconBase)`
  background-color: #3498db;
  border-radius: 50%;
`;

export const SquareIcon = styled(IconBase)`
  background-color: #f1c40f;
  border-radius: 4px;
`;

export const Separator = styled.hr`
  border: 1px dotted #34495e;
  margin: 15px 0;
`;

export const RewardText = styled.span`
  margin-left: auto;
  color: #f1c40f;
`;

export const ScoreText = styled.span`
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
`;

// Add more styled components for inline styles
export const GameContainer = styled.div`
  background-color: #1a472a;
  min-height: 100vh;
  width: 100vw;
  display: flex;
`;

export const LeftPanel = styled.div`
  width: 300px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
`;

export const ResetButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #858585;
  }
`;

export const BigBlindBox = styled.div`
  background-color: #8b4513;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const BigBlindHeader = styled.div`
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #704214;
  color: white;
  font-weight: bold;
`;

export const BigBlindContent = styled.div`
  padding: 10px;
  background-color: #2c3e50;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const BigBlindTarget = styled.div`
  font-size: 32px;
  color: #ff4444;
`;

export const ScoreBox = styled.div`
  background-color: #2c3e50;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const ScoreValue = styled.div`
  font-size: 32px;
  color: white;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const StatBox = styled.div`
  background-color: #2c3e50;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
`;

export const StatValue = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 24px;
  font-weight: bold;
`;

export const MainGameArea = styled.div`
  flex: 1;
  padding: 1vw;
`;

export const DeckAreaContainer = styled.div`
  display: flex;
  gap: 2vw;
`;

export const DeckSection = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
  background: rgba(0, 0, 0, 0.2);
`;

export const MemesSection = styled(DeckSection)`
  flex: 1;
`;

export const ShopContainer = styled.div`
  padding: 20px;
  background-color: #1e2a38;
  border-radius: 8px;
  margin-top: 20px;
`;

export const ShopButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

export const ShopButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 15px;
  background-color: ${(props) =>
    props.variant === "primary" ? "#E74C3C" : "#2ECC71"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const ShopItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
`;

export const ShopItem = styled.div`
  background-color: #2c3e50;
  border-radius: 8px;
  padding: 10px;
  position: relative;
`;

export const PriceTag = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #f1c40f;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
`;

export const ItemContainer = styled.div`
  aspect-ratio: 3/4;
  background-color: #34495e;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

export const PlayedHandArea = styled.div`
  min-height: 180px;
  margin-bottom: 20px;
  position: relative;
`;

export const PlayedHandContainer = styled.div<{ isLastPlayed: boolean }>`
  position: relative;
  opacity: ${(props) => (props.isLastPlayed ? 1 : 0)};
  display: ${(props) => (props.isLastPlayed ? "block" : "none")};
`;

export const CardRow = styled.div<{ isLastPlayed: boolean }>`
  padding: 4px;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  transform: ${(props) => (props.isLastPlayed ? "scale(1.05)" : "scale(1)")};
`;

export const CardWrapper = styled.div<{ index: number }>`
  margin-left: ${(props) => (props.index > 0 ? "20px" : "0")};
  position: relative;
  z-index: ${(props) => props.index};
`;

export const ScorePopup = styled(motion.div)`
  position: absolute;
  top: -40px;
  left: 50%;
  width: fit-content;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const ChipScore = styled.div`
  background: #0092ff;
  padding: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

export const MultScore = styled.div`
  background: #0092ff;
  padding: 10px;
  color: #fff;
  font-size: 12px;
`;

export const HandCardsArea = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin-top: auto;
`;

export const ReorderGroup = styled(Reorder.Group)`
  display: flex;
  justify-content: center;
  position: relative;
  min-height: 100px;
  list-style: none;
  margin: 0 auto;
  width: fit-content;
`;

export const CardSlot = styled.div<{ index: number; totalCards: number }>`
  margin-left: ${(props) =>
    props.index > 0 ? `-${Math.min(10 + props.totalCards, 10)}px` : "0"};
  position: relative;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

export const SortButton = styled.button<{ variant: "value" | "suit" }>`
  padding: 8px 16px;
  background-color: ${(props) =>
    props.variant === "value" ? "#3498db" : "#2ecc71"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const ActionButtonGroup = styled(motion.div)`
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled(motion.button)<{
  action: "play" | "discard";
  disabled: boolean;
}>`
  padding: 8px 16px;
  background-color: ${(props) => {
    if (props.disabled) return "#95a5a6";
    return props.action === "play" ? "#e67e22" : "#e74c3c";
  }};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const HandScoreContainer = styled.div`
  background-color: #2c3e50;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const HandTypeText = styled.div`
  color: white;
  margin-bottom: 5px;
`;

export const ScoreDisplay = styled.div`
  display: flex;
  gap: 5px;
  font-weight: bold;
  align-items: center;
  justify-content: center;
`;

export const ChipsDisplay = styled(motion.div)`
  background-color: #3498db;
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
  display: inline-block;
`;

export const MultiplierDisplay = styled.span`
  background-color: #e74c3c;
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
`;

// ... continue with other styled components as needed
