import { BoosterPosition, CardPosition } from "@/types/cards";
import { CardRank } from "./constants";

export function shuffleCards(
  cards: (CardPosition | BoosterPosition)[]
): (CardPosition | BoosterPosition)[] {
  const newCards = [...cards];
  // Fisher-Yates shuffle
  for (let i = newCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    // Update index property if objects have it
    newCards[i].index = i;
    newCards[i].id = i;
    newCards[j].index = j;
    newCards[j].id = j;
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
