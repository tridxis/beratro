import { CardPosition } from "@/types/cards";
import { CardSuit, SUIT_SYMBOLS } from "@/utils/constants";
import { Reorder } from "framer-motion";
import { useRef } from "react";
import { CARD_STYLES } from "@/utils/cardStyles";
import { BLACK_COLOR, RED_COLOR } from "@/utils/colors";
import { STICKER_STATS } from "@/utils/stickerStats";

const DraggableCard = ({
  card: { id, suit, rank, animalSticker, fruitSticker },
  isSelected,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  className,
}: {
  card: CardPosition;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  className: string;
}) => {
  const isDragging = useRef(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging.current) {
      onSelect(id);
    }
  };

  return (
    <Reorder.Item
      value={id}
      id={id.toString()}
      onDragStart={() => {
        isDragging.current = true;
      }}
      onDragEnd={() => {
        isDragging.current = false;
      }}
      initial={{ x: 300, opacity: 0 }}
      animate={{
        x: 0,
        y: isSelected ? -30 : 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          // delay: !isSelected && id * 0.1,
        },
      }}
      exit={{ x: -300, opacity: 0 }}
      style={{
        ...CARD_STYLES.container,
        color: [CardSuit.HEARTS, CardSuit.DIAMONDS].includes(suit)
          ? RED_COLOR
          : BLACK_COLOR,
        cursor: "grab",
        // zIndex: 100,
      }}
      whileHover={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
      whileDrag={{
        cursor: "grabbing",
        scale: 1.05,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.25)",
        zIndex: 3,
      }}
      onClick={handleCardClick}
      transition={{
        duration: 0.1,
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
    </Reorder.Item>
  );
};

export default DraggableCard;
