import { CardPosition } from "@/types/cards";
import { CardRank, CardSuit } from "./constants";

export const initialCards: CardPosition[] = [
  { id: 1, suit: CardSuit.HEARTS, rank: CardRank.ACE },
  { id: 2, suit: CardSuit.SPADES, rank: CardRank.KING },
  { id: 3, suit: CardSuit.DIAMONDS, rank: CardRank.QUEEN },
  { id: 4, suit: CardSuit.CLUBS, rank: CardRank.JACK },
  { id: 5, suit: CardSuit.HEARTS, rank: CardRank.TEN },
];
