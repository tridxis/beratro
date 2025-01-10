import {
  BG_COLOR,
  BLUE_COLOR,
  BORDER_COLOR,
  FLOOR_BORDER_COLOR,
  FLOOR_COLOR,
  GREEN_COLOR,
  RED_COLOR,
  WHITE_COLOR,
  WOOD_COLOR,
} from "@/utils/colors";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Reorder } from "framer-motion";

export const Button = styled.button`
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

export const RoundEndContainer = styled.div`
  padding: 1vw;
  background-color: ${FLOOR_COLOR};
  border: 0.2vw solid ${FLOOR_BORDER_COLOR};
  border-radius: 8px;
  color: white;
  flex: 2;
`;

export const CashOutButton = styled(Button)`
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
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${BG_COLOR};
  height: 100%;
  width: 100%;
  display: flex;
`;

export const LeftArea = styled.div`
  flex: 1;
  padding: 0.5vw;
  overflow: hidden;
`;

export const LeftPanel = styled.div`
  width: 100%;
  background: ${WOOD_COLOR};
  border: 0.2vw solid ${BORDER_COLOR};
  border-radius: 0.5vw;
  padding: 1vw;
  height: 100%;
`;

export const ResetButton = styled(Button)`
  width: 100%;
  background-color: ${WHITE_COLOR};
  color: ${BORDER_COLOR};
  margin-bottom: 1vw;
`;

export const BentoBox = styled.div`
  background-color: ${BG_COLOR};
  color: ${BORDER_COLOR};
  margin-bottom: 1vw;
  border-radius: 1vw;
  overflow: hidden;
`;

export const BigBlindHeader = styled.div`
  padding: 10px;
  background-color: ${BORDER_COLOR};
  color: ${WHITE_COLOR};
  font-size: 1.2vw;
  text-align: center;
  font-weight: bold;
`;

export const BigBlindContent = styled.div`
  padding: 0.5vw 1vw;
  font-size: 0.8vw;
`;

export const BigBlindTarget = styled.div`
  font-size: 1.2vw;
  color: ${RED_COLOR};
`;

export const ScoreValue = styled.div`
  font-size: 1.2vw;
  color: ${BORDER_COLOR};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1vw;
`;

export const StatBox = styled.div`
  background-color: ${BORDER_COLOR};
  color: ${WHITE_COLOR};
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
  flex: 3;
  padding: 0.5vw;
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

export const DeckAreaContainer = styled.div`
  display: flex;
  gap: 1vw;
  flex: 1;
`;

export const DeckSection = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.5vw;

  // &::before,
  // &::after {
  //   content: "";
  //   position: absolute;
  //   inset: 0;
  // }

  // &::before {
  //   border-bottom: 4px solid rgba(255, 255, 255, 0.9);
  //   border-left: 4px solid rgba(255, 255, 255, 0.9);
  //   transform: translate(2px, -2px);
  // }

  // &::after {
  //   border-top: 4px solid rgba(255, 255, 255, 0.9);
  //   border-right: 4px solid rgba(255, 255, 255, 0.9);
  //   transform: translate(-2px, 2px);
  // }
`;

export const MemesSection = styled(DeckSection)`
  flex: 1;
`;

export const ShopContainer = styled.div`
  padding: 20px;
  background-color: #1e2a38;
  border-radius: 8px;
  margin-top: 20px;
  flex: 2;
`;

export const ShopButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

export const ShopButton = styled(Button)<{ variant?: "primary" | "secondary" }>`
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
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: ${BLUE_COLOR};
  padding: 0.3vw;
  color: ${WHITE_COLOR};
  border: 0.2vw solid ${BORDER_COLOR};
  font-size: 1vw;
  font-weight: bold;
`;

export const MultScore = styled.div`
  background: ${RED_COLOR};
  padding: 0.3vw;
  border: 0.2vw solid ${BORDER_COLOR};
  color: ${WHITE_COLOR};
  font-size: 1vw;
  font-weight: bold;
`;

export const HandCardsArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const HandContainer = styled.div`
  width: 100%;
  height: fit-content;
  border-radius: 0.5vw;
  background-color: rgba(0, 0, 0, 0.1);
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

export const SortButton = styled(Button)<{ variant: "value" | "suit" }>``;

export const ActionButtonGroup = styled(motion.div)`
  display: flex;
  gap: 10px;
`;

export const ActionButton = styled(Button)<{
  action: "play" | "discard";
  disabled: boolean;
}>`
  background-color: ${(props) =>
    props.action === "play" ? GREEN_COLOR : RED_COLOR};
  color: ${(props) => (props.action === "play" ? "#fff" : "#fff")};
  width: 10vw;
`;

export const HandScoreContainer = styled.div`
  margin-bottom: 1vw;
`;

export const HandTypeText = styled.div`
  color: white;
  margin-bottom: 5px;
`;

export const ScoreDisplay = styled.div`
  display: flex;
  font-size: 1.2vw;
  gap: 0.5vw;
  font-weight: bold;
  align-items: center;
  justify-content: center;
`;

export const ChipsDisplay = styled(motion.div)`
  background-color: ${BLUE_COLOR};
  border: 0.15vw solid ${BORDER_COLOR};
  padding: 0.5vw;
  border-radius: 0.5vw;
  text-align: center;
  color: ${WHITE_COLOR};
  flex: 1;
  display: inline-block;
`;

export const MultiplierDisplay = styled.span`
  background-color: ${RED_COLOR};
  border: 0.15vw solid ${BORDER_COLOR};
  padding: 0.5vw;
  border-radius: 0.5vw;
  color: ${WHITE_COLOR};
  text-align: center;
  flex: 1;
`;

// ... continue with other styled components as needed
