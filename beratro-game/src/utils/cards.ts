import { CardPosition } from "@/types/cards";
import { CardRank } from "./constants";

export function shuffleCards<T>(cards: T[]): T[] {
  const newCards = [...cards];
  // Fisher-Yates shuffle
  for (let i = newCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
  }
  return newCards;
}

export function isFaceCard(card: CardPosition): boolean {
  return (
    card.rank === CardRank.JACK ||
    card.rank === CardRank.QUEEN ||
    card.rank === CardRank.KING
  );
}
