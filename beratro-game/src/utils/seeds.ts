import { CardPosition } from "@/types/cards";
import { Bera, CardRank, CardSuit } from "./constants";
import { BeraPosition } from "@/types/beras";
import { v4 as uuidv4 } from "uuid";

function generateSequentialIds(): number[] {
  // Create array of numbers from 1 to 52
  const ids = Array.from({ length: 52 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  return ids;
}

export const initCards = (): CardPosition[] => {
  const shuffledIds = generateSequentialIds();
  let idIndex = 0;

  const cards = [];

  for (const suit of Object.values(CardSuit)) {
    for (const rank of Object.values(CardRank)) {
      cards.push({
        id: uuidv4(),
        suit,
        rank,
        index: shuffledIds[idIndex],
      });

      idIndex++;
    }
  }

  return cards.sort((a, b) => a.index - b.index);
};
export const initBeras = () => {
  const gameBeras = Object.values(Bera);
  const deckBeras = gameBeras.map((bera, index) => ({
    id: uuidv4(),
    bera,
    index,
    level: 1, // Initialize with level 1
  }));

  return {
    gameBeras,
    deckBeras,
  };
};
