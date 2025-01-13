import { useGameStore } from "@/store/gameStore";
import { GameState } from "@/types/games";
import {
  BerasContainer,
  BerasTitle,
  CardsContainer,
  CardRow,
  Card,
  CardText,
  ContinueButton,
} from "./Beras.styles";

const Beras = () => {
  const { setCurrentState } = useGameStore();
  return (
    <BerasContainer>
      <BerasTitle>Beras This Game</BerasTitle>
      <CardsContainer>
        {/* First row - 6 cards */}
        <CardRow>
          {[...Array(6)].map((_, index) => (
            <Card key={`row1-${index}`}>
              <CardText>Bera #{index}</CardText>
            </Card>
          ))}
        </CardRow>

        {/* Middle row - 8 cards */}
        <CardRow>
          {[...Array(8)].map((_, index) => (
            <Card key={`row2-${index}`}>
              <CardText>Bera #{index + 6}</CardText>
            </Card>
          ))}
        </CardRow>

        {/* Last row - 6 cards */}
        <CardRow>
          {[...Array(6)].map((_, index) => (
            <Card key={`row3-${index}`}>
              <CardText>Bera #{index + 14}</CardText>
            </Card>
          ))}
        </CardRow>
      </CardsContainer>
      <ContinueButton onClick={() => setCurrentState(GameState.PLAYING)}>
        Continue
      </ContinueButton>
    </BerasContainer>
  );
};

export default Beras;
