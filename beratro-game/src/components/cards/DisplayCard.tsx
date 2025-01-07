import { CardPosition } from "@/types/cards";
import { CardSuit, SUIT_SYMBOLS } from "@/utils/constants";
import React from "react";
import { CARD_STYLES } from "@/utils/cardStyles";

interface DisplayCardProps {
  card: CardPosition;
}

export const DisplayCard: React.FC<DisplayCardProps> = ({ card }) => {
  const { rank, suit } = card;

  return (
    <div
      style={{
        ...CARD_STYLES.container,
        color: [CardSuit.HEARTS, CardSuit.DIAMONDS].includes(suit)
          ? "red"
          : "black",
      }}
    >
      <div style={CARD_STYLES.topRank}>{rank}</div>
      <div style={CARD_STYLES.suit}>{SUIT_SYMBOLS[suit]}</div>
      <div style={CARD_STYLES.bottomRank}>{rank}</div>
    </div>
  );
};
