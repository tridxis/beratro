import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARD_STYLES } from "@/utils/cardStyles";
import { BoosterPosition } from "@/types/cards";
import { MEME_STATS } from "@/utils/memeStats";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { STICKER_STATS } from "@/utils/stickerStats";
import { Flower, HAND_NAMES, Sticker } from "@/utils/constants";
import { Meme } from "@/utils/constants";
import { BLACK_COLOR, WOOD_COLOR } from "@/utils/colors";
import { BottomButtonContainer, SellButton, UseButton } from "../Game.styles";

interface BoosterProps {
  item: BoosterPosition;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onUse?: () => void;
  onSell?: () => void;
}

export const Booster = ({
  item,
  isSelected,
  onClick,
  onUse,
  onSell,
}: BoosterProps) => {
  const { booster, boosterType } = item;

  const { name, description } = (() => {
    switch (boosterType) {
      case "flower":
        return {
          name: FLOWER_STATS[booster as Flower].title,
          description: `Upgrade ${
            HAND_NAMES[FLOWER_STATS[booster as Flower].hand]
          } by 1 level`,
        };
      case "meme":
        return MEME_STATS[booster as Meme];
      case "sticker":
        return STICKER_STATS[booster as Sticker];
      default:
        return { name: "", description: "" };
    }
  })();

  return (
    <div
      style={{ position: "relative" }}
      className="booster-card"
      onClick={onClick}
    >
      <div
        style={{
          ...CARD_STYLES.container,
          textAlign: "center",
          padding: "1vw",
          cursor: "pointer",
        }}
      >
        <div style={{ fontSize: "1.2vw", color: BLACK_COLOR }}>{name}</div>
        <div style={{ fontSize: "0.8vw", color: WOOD_COLOR }}>
          {description}
        </div>
      </div>
      <AnimatePresence>
        {isSelected && (
          <BottomButtonContainer
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <UseButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onUse?.();
              }}
            >
              Use
            </UseButton>
            <SellButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onSell?.();
              }}
            >
              Sell 2$
            </SellButton>
          </BottomButtonContainer>
        )}
      </AnimatePresence>
    </div>
  );
};
