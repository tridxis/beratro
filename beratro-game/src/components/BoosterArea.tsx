import { hoverScaleAnimation } from "@/utils/animations";
import { HAND_NAMES, Flower, Sticker, Meme } from "@/utils/constants";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { MEME_STATS } from "@/utils/memeStats";
import { STICKER_STATS } from "@/utils/stickerStats";
import { motion } from "framer-motion";
import React from "react";
import { Booster } from "./cards/Booster";
import { TopSection, DeckContainer, DeckDescription } from "./Game.styles";
import { BoosterPosition } from "@/types/cards";
import { BeraPosition } from "@/types/beras";

interface BoosterAreaProps {
  boosters: BoosterPosition[];
  selectedBooster: BoosterPosition | null;
  selectedBeras: string[];
  selectedCards: string[];
  setSelectedBooster: (booster: BoosterPosition | null) => void;
  handleTooltip: (
    show: boolean,
    content?: React.ReactNode,
    event?: React.MouseEvent,
    position?: "top" | "bottom" | "right"
  ) => void;
  handleActivateBooster: (booster: BoosterPosition) => void;
  sellBooster: (boosterId: string) => void;
}
const BoosterArea = ({
  boosters,
  selectedBooster,
  setSelectedBooster,
  handleActivateBooster,
  sellBooster,
  handleTooltip,
  selectedBeras,
  selectedCards,
}: BoosterAreaProps) => {
  return (
    <TopSection flex={1}>
      <DeckContainer>
        {boosters.map((booster, index) => (
          <motion.div
            key={`booster-${index}`}
            whileHover="hover"
            variants={hoverScaleAnimation}
            style={{ position: "relative" }}
            onMouseEnter={(e) => {
              handleTooltip(
                true,
                booster.boosterType === "flower"
                  ? `Upgrade ${
                      HAND_NAMES[FLOWER_STATS[booster.booster as Flower].hand]
                    } by 1 level`
                  : booster.boosterType === "sticker"
                  ? STICKER_STATS[booster.booster as Sticker].description
                  : MEME_STATS[booster.booster as Meme].description,
                e,
                "bottom"
              );
            }}
            onMouseLeave={() => handleTooltip(false)}
          >
            <Booster
              item={booster}
              isSelected={selectedBooster?.id === booster.id}
              selectedBeras={selectedBeras}
              selectedCards={selectedCards}
              onUse={() => {
                handleActivateBooster(booster);
              }}
              onSell={() => {
                sellBooster(booster.id);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBooster(
                  selectedBooster?.id === booster.id ? null : booster
                );
              }}
            />
          </motion.div>
        ))}
      </DeckContainer>
      <DeckDescription>{boosters.length}/2</DeckDescription>
    </TopSection>
  );
};

export default BoosterArea;
