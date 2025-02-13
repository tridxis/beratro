import {
  LeftArea,
  LeftPanel as StyledLeftPanel,
  ResetButton,
  BentoBox,
  RoundHeader,
  RoundContent,
  FlexRow,
  ScoreTarget,
  StatsGrid,
  StatBox,
  StatValue,
  LeftPanel,
} from "./Game.styles";
import { BLUE_COLOR, GOLD_COLOR, RED_COLOR } from "@/utils/colors";
import { HandType } from "@/utils/constants";
import { Breakdown } from "@/types/hands";
import { CardPosition } from "@/types/cards";
import { Score } from "./Score";
import { useState } from "react";
import { HandInfoDialog } from "./HandInfoDialog";
import { AnimatePresence } from "framer-motion";
import Button from "./Button";
import Stats from "./Stats";

interface LeftPanelProps {
  round: number;
  reqScore: number;
  score: number;
  currentBreakdown: Breakdown | null;
  pokerHand: HandType | undefined;
  upgradingHand: HandType | undefined;
  handLevels: { [key: string]: number };
  previewPokerHand: { chips: number; mult: number } | null;
  maxHands: number;
  playedHands: CardPosition[][];
  maxDiscards: number;
  discards: CardPosition[][];
  gold: number;
  reset: () => void;
  dealCards: () => void;
}

export const LeftSection = ({
  round,
  reqScore,
  score,
  currentBreakdown,
  pokerHand,
  upgradingHand,
  handLevels,
  previewPokerHand,
  maxHands,
  playedHands,
  maxDiscards,
  discards,
  gold,
  reset,
  dealCards,
}: LeftPanelProps) => {
  const [showHandInfo, setShowHandInfo] = useState(false);

  return (
    <LeftArea>
      <LeftPanel>
        <ResetButton
          onClick={() => {
            reset();
            dealCards();
          }}
        >
          Reset
        </ResetButton>

        <BentoBox>
          <RoundHeader>ROUND {round}</RoundHeader>
          <RoundContent>
            <FlexRow style={{ justifyContent: "space-between" }}>
              <div>
                <div>Score at least</div>
                <ScoreTarget>{reqScore.toLocaleString()}</ScoreTarget>
              </div>
              <div>to earn $$$$</div>
            </FlexRow>
          </RoundContent>
        </BentoBox>

        <Score
          score={score}
          pokerHand={pokerHand}
          upgradingHand={upgradingHand}
          handLevels={handLevels}
          currentBreakdown={currentBreakdown}
          previewPokerHand={previewPokerHand}
        />

        <Stats
          maxHands={maxHands}
          playedHands={playedHands}
          maxDiscards={maxDiscards}
          discards={discards}
          gold={gold}
        />
        <Button
          onClick={() => setShowHandInfo(true)}
          style={{
            marginTop: "1vw",
            width: "100%",
            backgroundColor: BLUE_COLOR,
          }}
        >
          Hand Info
        </Button>
        <AnimatePresence>
          {showHandInfo && (
            <HandInfoDialog
              handLevels={handLevels}
              onClose={() => setShowHandInfo(false)}
            />
          )}
        </AnimatePresence>
      </LeftPanel>
    </LeftArea>
  );
};
