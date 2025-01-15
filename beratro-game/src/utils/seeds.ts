import { CardPosition } from "@/types/cards";
import { Bera, CardRank, CardSuit } from "./constants";
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
        index: shuffledIds[idIndex++],
      }))
    )
    .sort((a, b) => a.index - b.index);
};

export const initBeras = (): {
  gameBeras: Bera[];
  deckBeras: BeraPosition[];
} => {
  // Get all playable Beras (excluding special ones)
  const allBeras = Object.values(Bera);

  // Randomly select 20 Beras
  const selectedBeras: Bera[] = [];
  const tempBeras = [...allBeras];

  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * tempBeras.length);
    selectedBeras.push(tempBeras[randomIndex]);
    tempBeras.splice(randomIndex, 1);
  }

  // Create array of shuffled IDs
  const shuffledIds = Array.from({ length: 160 }, (_, i) => i + 1);
  for (let i = shuffledIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
  }

  // Create deck with 8 copies of each selected Bera
  const deckBeras: BeraPosition[] = [];
  selectedBeras.forEach((bera) => {
    for (let i = 0; i < 8; i++) {
      deckBeras.push({
        id: shuffledIds[deckBeras.length],
        bera,
        index: shuffledIds[deckBeras.length],
      });
    }
  });

  return {
    gameBeras: selectedBeras, // The 20 randomly selected Beras
    deckBeras: deckBeras.sort((a, b) => a.index - b.index), // The shuffled deck with 160 cards (20 Beras × 8 copies each)
  };
};
