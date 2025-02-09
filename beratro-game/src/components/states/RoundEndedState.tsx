import { CardPosition } from "@/types/cards";
import {
  RoundEndContainer,
  CashOutButton,
  EndInfoContainer,
  FlexRow,
  ScoreAtLeastTag,
  ScoreText,
  RewardText,
  Separator,
  EndInfoText,
} from "../Game.styles";

interface RoundEndedStateProps {
  reqScore: number;
  roundGold: number;
  maxHands: number;
  playedHands: CardPosition[][];
  gold: number;
  bonusGolds: { title: string; value: number }[];
  goldEarned: number;
  endRound: (gold: number) => void;
  setBonusGolds: (golds: { title: string; value: number }[]) => void;
}

export const RoundEndedState = ({
  reqScore,
  roundGold,
  maxHands,
  playedHands,
  gold,
  bonusGolds,
  goldEarned,
  endRound,
  setBonusGolds,
}: RoundEndedStateProps) => {
  return (
    <RoundEndContainer>
      <CashOutButton
        onClick={() => {
          endRound(goldEarned);
          setBonusGolds([]);
        }}
      >
        Cash Out: ${goldEarned}
      </CashOutButton>
      <EndInfoContainer>
        <FlexRow>
          <ScoreAtLeastTag>Score as least</ScoreAtLeastTag>
          <ScoreText>{reqScore.toLocaleString()}</ScoreText>
          <RewardText>{"$".repeat(roundGold)}</RewardText>
        </FlexRow>

        <Separator />

        <FlexRow>
          <EndInfoText>Remaining Hands ($1 each)</EndInfoText>
          <RewardText>
            {maxHands - playedHands.length > 0
              ? "$".repeat(maxHands - playedHands.length)
              : "-"}
          </RewardText>
        </FlexRow>

        <FlexRow>
          <EndInfoText>1 Interest per $5 (5 max)</EndInfoText>
          <RewardText>
            {Math.floor(gold / 5) > 0
              ? "$".repeat(Math.min(5, Math.floor(gold / 5)))
              : "-"}
          </RewardText>
        </FlexRow>

        {bonusGolds.map((gold, index) => (
          <FlexRow key={`bonus-gold-${index}`}>
            <EndInfoText>{gold.title}</EndInfoText>
            <RewardText>{"$".repeat(gold.value)}</RewardText>
          </FlexRow>
        ))}
      </EndInfoContainer>
    </RoundEndContainer>
  );
};
