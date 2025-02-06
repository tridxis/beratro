import useAnimatedCounter from "@/hooks/useAnimatedCounter";
import {
  LeftArea,
  LeftPanel as StyledLeftPanel,
  ResetButton,
  BentoBox,
  RoundHeader,
  RoundContent,
  FlexRow,
  ScoreTarget,
  ScoreValue,
  StatsGrid,
  StatBox,
  StatValue,
} from "./Game.styles";
import { BLUE_COLOR, GOLD_COLOR, RED_COLOR } from "@/utils/colors";
import { HandScore } from "./Score";
import { HandType } from "@/utils/constants";
import { Breakdown } from "@/types/hands";
import { CardPosition } from "@/types/cards";

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

export const LeftPanel = ({
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
  return (
    <LeftArea>
      <StyledLeftPanel>
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

        <BentoBox style={{ padding: "1vw" }}>
          <div>Round score</div>
          <ScoreValue>
            {useAnimatedCounter(
              score ||
                currentBreakdown?.chips ||
                0 * (currentBreakdown?.mult || 0)
            )}
          </ScoreValue>
        </BentoBox>

        <HandScore
          pokerHand={pokerHand}
          upgradingHand={upgradingHand}
          handLevels={handLevels}
          currentBreakdown={currentBreakdown}
          previewPokerHand={previewPokerHand}
        />

        <StatsGrid>
          <StatBox>
            <div>Hands</div>
            <StatValue color={BLUE_COLOR}>
              {maxHands - playedHands.length}
            </StatValue>
          </StatBox>
          <StatBox>
            <div>Discards</div>
            <StatValue color={RED_COLOR}>
              {maxDiscards - discards.length}
            </StatValue>
          </StatBox>
          <StatBox>
            <div>Golds</div>
            <StatValue color={GOLD_COLOR}>{gold}</StatValue>
          </StatBox>
        </StatsGrid>
      </StyledLeftPanel>
    </LeftArea>
  );
};
