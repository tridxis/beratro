import {
  BG_COLOR,
  BORDER_COLOR,
  BLUE_COLOR,
  FLOOR_BORDER_COLOR,
  FLOOR_COLOR,
  GREEN_COLOR,
  RED_COLOR,
  WHITE_COLOR,
  WOOD_COLOR,
  BLACK_COLOR,
  GOLD_COLOR,
  DARK_GOLD_COLOR,
} from "@/utils/colors";
import styled from "@emotion/styled";
import { color, motion } from "framer-motion";
import { Reorder } from "framer-motion";
import { AnimatedValueDisplay } from "./AnimatedValueDisplay";
import Button from "./Button";
import { CARD_STYLES } from "@/utils/cardStyles";

export const RoundEndContainer = styled.div`
  padding: 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  color: white;
  flex: 2;
  gap: 2vw;
  width: 44vw;
  margin: auto;
`;

export const CashOutButton = styled(Button)`
  background-color: ${DARK_GOLD_COLOR};
  border-radius: 1vw;
  color: white;
  height: 5vw;
  width: 20vw;
  font-size: 2vw;
  font-weight: bold;
  cursor: pointer;
`;

export const EndInfoContainer = styled.div`
  flex: 1;
  width: 40vw;
  gap: 0.5vw;
  display: flex;
  flex-direction: column;
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
  background-color: ${BLUE_COLOR};
  border-radius: 50%;
`;

export const ScoreAtLeastTag = styled.div`
  background-color: ${BLUE_COLOR};
  border-radius: 0.5vw;
  padding: 0.2vw 0.5vw;
  color: ${WHITE_COLOR};
  font-size: 0.8vw;
  margin-right: 0.5vw;
`;

export const SquareIcon = styled(IconBase)`
  background-color: #f1c40f;
  border-radius: 4px;
`;

export const Separator = styled.hr`
  border: 1px dashed ${WOOD_COLOR};
  margin: 15px 0;
`;

export const RewardText = styled.span`
  margin-left: auto;
  color: ${DARK_GOLD_COLOR};
  font-size: 1vw;
  max-width: 20vw;
  word-break: break-word;
`;

export const EndInfoText = styled.span`
  color: ${BORDER_COLOR};
  font-size: 1vw;
`;

export const ScoreText = styled.span`
  color: ${RED_COLOR};
  font-size: 2vw;
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
  flex: 25% 0 0;
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

export const RoundHeader = styled.div`
  padding: 10px;
  background-color: ${BORDER_COLOR};
  color: ${WHITE_COLOR};
  font-size: 1.2vw;
  text-align: center;
  font-weight: bold;
`;

export const RoundContent = styled.div`
  padding: 0.5vw 1vw;
  font-size: 0.8vw;
`;

export const ScoreTarget = styled.div`
  font-size: 1.2vw;
  color: ${RED_COLOR};
`;

export const ScoreValue = styled(motion.div)`
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
  padding: 0.5vw;
  border-radius: 0.5vw;
  text-align: center;
  font-size: 0.8vw;
`;

export const StatValue = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 2vw;
  font-weight: bold;
`;

export const MainGameArea = styled.div`
  flex: 75% 0 0;
  padding: 0.5vw;
  display: flex;
  flex-direction: column;
  gap: 1vw;
  & > div {
    width: 100%;
  }
`;

export const DeckAreaContainer = styled.div`
  display: flex;
  gap: 1vw;
  flex: 1;
`;

export const TopSection = styled.div<{ flex: number }>`
  flex: ${(props) => props.flex};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${BORDER_COLOR};
`;

export const DeckContainer = styled.div`
  width: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.5vw;
  height: 12vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 0.8vw;
`;

export const DeckDescription = styled.div`
  width: 100%;
  text-align: right;
  padding: 0.2vw;
  font-size: 0.8vw;
`;

export const ShopContainer = styled.div`
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  flex: 2;
  & h3 {
    font-size: 1.5vw;
    text-align: center;
    color: ${BORDER_COLOR};
  }
`;

export const ShopButtonGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
  justify-content: center;
`;

export const ShopButton = styled(Button)<{ variant?: "primary" | "secondary" }>`
  padding: 1vw;
  background-color: ${(props) =>
    props.variant === "primary" ? "#E74C3C" : "#2ECC71"};
  color: white;
  border-radius: 2vw;
  font-size: 1vw;
  cursor: pointer;
  transition: opacity 0.2s;
  height: 4vw;

  &:hover {
    opacity: 0.9;
  }
`;

export const BuyButton = styled(Button)`
  position: absolute;
  bottom: -1vw;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: fit-content;
  padding: 0.5vw;
  font-size: 1vw;

  &:hover:not(:disabled) {
    padding-top: 0.4vw;
    padding-bottom: 0.6vw;
  }

  &:active:not(:disabled) {
    padding-top: 0.45vw;
    padding-bottom: 0.55vw;
  }
`;

export const BottomButtonContainer = styled.div`
  position: absolute;
  bottom: -1vw;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5vw;
  z-index: 10;

  & button {
    padding: 0.5vw;
    &:hover:not(:disabled) {
      padding-top: 0.4vw;
      padding-bottom: 0.6vw;
    }

    &:active:not(:disabled) {
      padding-top: 0.45vw;
      padding-bottom: 0.55vw;
    }
  }
`;

export const UseButton = styled(Button)`
  background-color: ${BLUE_COLOR};
  color: ${WHITE_COLOR};
`;

export const SellButton = styled(Button)`
  background-color: ${RED_COLOR};
  color: ${WHITE_COLOR};
`;

export const MergeButton = styled(Button)`
  background-color: ${BLUE_COLOR};
  color: ${WHITE_COLOR};
`;

export const ShopItemsGrid = styled.div`
  display: block;
  gap: 1vw;
`;

export const ShopItem = styled.div`
  cursor: pointer;
  background-color: ${CARD_STYLES.container.backgroundColor};
  border: ${CARD_STYLES.container.border};
  border-radius: 8px;
  width: ${CARD_STYLES.container.width};
  height: ${CARD_STYLES.container.height};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${BLACK_COLOR};
  font-size: 1vw;
  & span {
    color: ${BORDER_COLOR};
    text-align: center;
    padding: 0.25vw;
    display: block;
    font-size: 0.5vw;
  }
`;

export const StickerItem = styled.div`
  position: absolute;
  top: 0.2vw;
  left: 0.2vw;
  right: 0.2vw;
  font-size: 1.5vw;
  text-align: center;
  background: ${BORDER_COLOR};
  width: 1.8vw;
  height: 1.8vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

export const ShopItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1vw;
`;

export const ShopSection = styled.div`
  margin-top: 2vw;
`;

export const PriceTag = styled.div`
  position: absolute;
  top: -0.75vw;
  right: -0.75vw;
  background-color: #f1c40f;
  padding: 0.25vw 0.5vw;
  border-radius: 2vw;
  font-size: 0.75vw;
  font-weight: bold;
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
  gap: 1vw;
  transform: ${(props) => (props.isLastPlayed ? "scale(1.05)" : "scale(1)")};
`;

export const CardWrapper = styled.div<{ index: number; totalCards: number }>`
  width: ${({ totalCards }) =>
    `calc(min(${CARD_STYLES.container.width}, ${50 / totalCards}vw))`};
  position: relative;
  z-index: ${(props) => props.index};
`;

export const ScorePopup = styled(motion.div)<{ type: "bera" | "card" }>`
  position: absolute;
  ${(props) => (props.type === "bera" ? "bottom: -3vw" : "top: -2.5vw")};
  right: 0;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const BaseScore = styled.div`
  padding: 0.3vw 0.5vw;
  color: ${WHITE_COLOR};
  border: 0.1vw solid ${BORDER_COLOR};
  border-radius: 0.5vw;
  font-size: 1vw;
  font-weight: bold;
`;

export const ChipScore = styled(BaseScore)`
  background: ${BLUE_COLOR};
`;

export const MultScore = styled(BaseScore)`
  background: ${RED_COLOR};
`;

export const GoldScore = styled(BaseScore)`
  background: ${DARK_GOLD_COLOR};
`;

export const RetriggerScore = styled(BaseScore)`
  background: ${GREEN_COLOR};
  color: ${WHITE_COLOR};
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
  background-color: rgba(0, 0, 0, 0.05);
`;

export const ReorderGroup = styled(Reorder.Group)`
  display: flex;
  justify-content: center;
  position: relative;
  min-height: 100px;
  list-style: none;
  margin: 0 auto;
  width: fit-content;
  padding: 0;
`;

export const CardSlot = styled.div<{ index: number; totalCards: number }>`
  position: relative;
  width: ${({ totalCards }) => `${50 / totalCards}vw`};
  display: flex;
  justify-content: center;
  align-items: center;
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
  background-color: ${BG_COLOR};
  border-radius: 1vw;
  padding: 1vw;
  text-align: center;
  color: ${BORDER_COLOR};
`;

export const HandTypeText = styled.div`
  color: ${BORDER_COLOR};
  margin-bottom: 0.5vw;
  height: 2vw;
  font-size: 1.2vw;
`;

export const ScoreDisplay = styled(motion.div)`
  display: flex;
  font-size: 1.2vw;
  gap: 0.5vw;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const ChipsDisplay = styled(AnimatedValueDisplay)`
  background-color: ${BLUE_COLOR};
  border: 0.15vw solid ${BORDER_COLOR};
  padding: 0.5vw;
  border-radius: 0.5vw;
  text-align: center;
  color: ${WHITE_COLOR};
  flex: 1;
`;

export const MultiplierDisplay = styled(AnimatedValueDisplay)`
  background-color: ${RED_COLOR};
  border: 0.15vw solid ${BORDER_COLOR};
  padding: 0.5vw;
  border-radius: 0.5vw;
  color: ${WHITE_COLOR};
  text-align: center;
  flex: 1;
`;

export const SkipButton = styled(Button)`
  background-color: ${WOOD_COLOR};
  color: ${WHITE_COLOR};
  margin-top: 1vw;
  width: 10vw;
  margin: 1vw auto;
  display: block;
`;

export const EmptyItem = styled.div`
  width: ${CARD_STYLES.container.width};
  height: ${CARD_STYLES.container.height};
  border: 0.1vw solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  text-align: center;
`;

// ... continue with other styled components as needed
