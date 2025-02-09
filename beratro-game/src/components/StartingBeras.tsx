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
} from "./StartingBeras.styles";
import { BERA_STATS } from "@/utils/beraStats";
import { useState } from "react";
import { Bera } from "@/utils/constants";

const StartingBeras = () => {
  const { setCurrentState, gameBeras } = useGameStore();
  const [hoveredBera, setHoveredBera] = useState<string | null>(null);

  // Group beras into rows
  const firstRow = gameBeras.slice(0, 6);
  const middleRow = gameBeras.slice(6, 14);
  const lastRow = gameBeras.slice(14, 20);

  const getBeraContent = (bera: Bera): string => {
    if (hoveredBera === bera) {
      return BERA_STATS[bera].description.replace(
        "{{value}}",
        `${BERA_STATS[bera].values[0]}/${BERA_STATS[bera].values[1]}/${BERA_STATS[bera].values[2]}`
      );
    }
    return BERA_STATS[bera].name;
  };

  return (
    <BerasContainer>
      <BerasTitle>Beras This Game</BerasTitle>
      <CardsContainer>
        <CardRow>
          {firstRow.map((bera) => (
            <Card
              isHovered={hoveredBera === bera}
              key={bera}
              onMouseEnter={() => setHoveredBera(bera)}
              onMouseLeave={() => setHoveredBera(null)}
            >
              <CardText>{getBeraContent(bera)}</CardText>
            </Card>
          ))}
        </CardRow>

        <CardRow>
          {middleRow.map((bera) => (
            <Card
              isHovered={hoveredBera === bera}
              key={bera}
              onMouseEnter={() => setHoveredBera(bera)}
              onMouseLeave={() => setHoveredBera(null)}
            >
              <CardText>{getBeraContent(bera)}</CardText>
            </Card>
          ))}
        </CardRow>

        <CardRow>
          {lastRow.map((bera) => (
            <Card
              isHovered={hoveredBera === bera}
              key={bera}
              onMouseEnter={() => setHoveredBera(bera)}
              onMouseLeave={() => setHoveredBera(null)}
            >
              <CardText>{getBeraContent(bera)}</CardText>
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

export default StartingBeras;
