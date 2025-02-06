import { BLUE_COLOR, RED_COLOR, GOLD_COLOR } from "@/utils/colors";
import React from "react";
import { StatsGrid, StatBox, StatValue } from "./Game.styles";
import { CardPosition } from "@/types/cards";

interface StatsProps {
  maxHands: number;
  playedHands: CardPosition[][];
  maxDiscards: number;
  discards: CardPosition[][];
  gold: number;
}

const Stats = ({
  maxHands,
  playedHands,
  maxDiscards,
  discards,
  gold,
}: StatsProps) => {
  return (
    <StatsGrid>
      <StatBox>
        <div>Hands</div>
        <StatValue color={BLUE_COLOR}>
          {maxHands - playedHands.length}
        </StatValue>
      </StatBox>
      <StatBox>
        <div>Discards</div>
        <StatValue color={RED_COLOR}>{maxDiscards - discards.length}</StatValue>
      </StatBox>
      <StatBox>
        <div>Golds</div>
        <StatValue color={GOLD_COLOR}>{gold}</StatValue>
      </StatBox>
    </StatsGrid>
  );
};

export default Stats;
