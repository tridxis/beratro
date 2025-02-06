import { motion } from "framer-motion";
import { HandType } from "@/utils/constants";
import { HAND_NAMES, HAND_VALUES } from "@/utils/constants";
import {
  HandScoreContainer,
  HandTypeText,
  ScoreDisplay,
  ChipsDisplay,
  MultiplierDisplay,
  BentoBox,
  ScoreValue,
} from "./Game.styles";
import { Breakdown } from "@/types/hands";
import useAnimatedCounter from "@/hooks/useAnimatedCounter";

interface ScoreProps {
  pokerHand: HandType | undefined;
  upgradingHand: HandType | undefined;
  handLevels: { [key: string]: number };
  currentBreakdown: Breakdown | null;
  previewPokerHand: { chips: number; mult: number } | null;
  score: number;
}

export const Score = ({
  pokerHand,
  upgradingHand,
  handLevels,
  currentBreakdown,
  previewPokerHand,
  score,
}: ScoreProps) => {
  return (
    <>
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
      <HandScoreContainer>
        {(!!pokerHand || upgradingHand) && (
          <>
            <HandTypeText>
              {upgradingHand ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {HAND_NAMES[upgradingHand]} Lvl{" "}
                  {handLevels[upgradingHand] || 1}
                </motion.div>
              ) : (
                `${pokerHand} Lvl ${handLevels[pokerHand as HandType] || 1}`
              )}
            </HandTypeText>
            <ScoreDisplay>
              <ChipsDisplay
                value={
                  currentBreakdown?.chips ||
                  (HAND_VALUES[upgradingHand as HandType]?.chips ||
                    previewPokerHand?.chips ||
                    0) +
                    ((handLevels[upgradingHand || (pokerHand as HandType)] ||
                      1) -
                      1) *
                      HAND_VALUES[upgradingHand || (pokerHand as HandType)]
                        .chipsLvl
                }
              />
              <span style={{ fontSize: "2vw" }}>×</span>
              <MultiplierDisplay
                value={
                  currentBreakdown?.mult ||
                  (HAND_VALUES[upgradingHand as HandType]?.mult ||
                    previewPokerHand?.mult ||
                    0) +
                    ((handLevels[upgradingHand || (pokerHand as HandType)] ||
                      1) -
                      1) *
                      HAND_VALUES[upgradingHand || (pokerHand as HandType)]
                        .multLvl
                }
              />
            </ScoreDisplay>
          </>
        )}
      </HandScoreContainer>
    </>
  );
};
