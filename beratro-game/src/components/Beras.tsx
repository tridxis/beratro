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
import { BERA_STATS } from "@/utils/beraStats";

const Beras = () => {
  const { setCurrentState, gameBeras } = useGameStore();

  // Group beras into rows
  const firstRow = gameBeras.slice(0, 6);
  const middleRow = gameBeras.slice(6, 14);
  const lastRow = gameBeras.slice(14, 20);

  return (
    <BerasContainer>
      <BerasTitle>Beras This Game</BerasTitle>
      <CardsContainer>
        <CardRow>
          {firstRow.map((bera) => (
            <Card key={bera}>
              <CardText>{BERA_STATS[bera].name}</CardText>
            </Card>
          ))}
        </CardRow>

        <CardRow>
          {middleRow.map((bera) => (
            <Card key={bera}>
              <CardText>{BERA_STATS[bera].name}</CardText>
            </Card>
          ))}
        </CardRow>

        <CardRow>
          {lastRow.map((bera) => (
            <Card key={bera}>
              <CardText>{BERA_STATS[bera].name}</CardText>
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
