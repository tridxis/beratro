import { CardPosition } from "@/types/cards";
import { CardRank, CardSuit } from "./constants";
import { BeraPosition } from "@/types/beras";

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

  return Object.values(CardSuit)
    .flatMap((suit) =>
      Object.values(CardRank).map((rank) => ({
        id: shuffledIds[idIndex++],
        suit,
        rank,
      }))
    )
    .sort((a, b) => a.id - b.id);
};

export const gameBeras: BeraPosition[] = 