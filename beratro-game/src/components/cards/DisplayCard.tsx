import { CardPosition } from "@/types/cards";
import { CardSuit, SUIT_SYMBOLS } from "@/utils/constants";
import React from "react";
import { CARD_STYLES } from "@/utils/cardStyles";
import { STICKER_STATS } from "@/utils/stickerStats";

interface DisplayCardProps {
  card: CardPosition;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export const DisplayCard: React.FC<DisplayCardProps> = ({
  card,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { rank, suit, fruitSticker, animalSticker } = card;

  return (
    <div
      style={{
        ...CARD_STYLES.container,
        color: [CardSuit.HEARTS, CardSuit.DIAMONDS].includes(suit)
          ? "red"
          : "black",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={CARD_STYLES.topRank}>
        {rank}
        <div style={CARD_STYLES.topSuit}>{SUIT_SYMBOLS[suit]}</div>
      </div>
      <div style={CARD_STYLES.suit}>{SUIT_SYMBOLS[suit]}</div>
      <div style={CARD_STYLES.bottomRank}>
        {rank}
        <div style={CARD_STYLES.bottomSuit}>{SUIT_SYMBOLS[suit]}</div>
      </div>
      {!!fruitSticker && (
        <div style={CARD_STYLES.fruitSticker}>
          {STICKER_STATS[fruitSticker].emoji}
        </div>
      )}
      {!!animalSticker && (
        <div style={CARD_STYLES.animalSticker}>
          {STICKER_STATS[animalSticker].emoji}
        </div>
      )}
    </div>
  );
};
