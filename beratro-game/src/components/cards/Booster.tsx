import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARD_STYLES } from "@/utils/cardStyles";
import { BoosterPosition } from "@/types/cards";
import { MEME_STATS } from "@/utils/memeStats";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { STICKER_STATS } from "@/utils/stickerStats";
import { Flower, Sticker } from "@/utils/constants";
import { Meme } from "@/utils/constants";
import { BLACK_COLOR } from "@/utils/colors";
import { BottomButtonContainer, SellButton, UseButton } from "../Game.styles";

interface BoosterProps {
  item: BoosterPosition;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onUse?: () => void;
  onSell?: () => void;
  selectedBeras?: string[];
  selectedCards?: string[];
}

export const Booster = ({
  item,
  isSelected,
  onClick,
  onUse,
  onSell,
  onMouseEnter,
  onMouseLeave,
  selectedBeras,
  selectedCards,
}: BoosterProps & {
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}) => {
  const { booster, boosterType } = item;

  const { name, usable } = (() => {
    switch (boosterType) {
      case "flower":
        return {
          name: FLOWER_STATS[booster as Flower].title,
          usable: true,
        };
      case "meme":
        return { ...MEME_STATS[booster as Meme], usable: true };
      case "sticker": {
        const stats = STICKER_STATS[booster as Sticker];
        const usable =
          stats.kind === "bera"
            ? selectedBeras?.length === 1
            : selectedCards?.length === 1;
        return { ...stats, usable };
      }
      default:
        return { name: "" };
    }
  })();

  return (
    <div
      style={{ position: "relative" }}
      className="booster-card"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
            {usable && (
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
            )}
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
