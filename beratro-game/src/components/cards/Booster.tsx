import React from "react";
import { CARD_STYLES } from "@/utils/cardStyles";
import { BoosterPosition } from "@/types/cards";
import { MEME_STATS } from "@/utils/memeStats";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { STICKER_STATS } from "@/utils/stickerStats";
import { Flower, HAND_NAMES, Sticker } from "@/utils/constants";
import { Meme } from "@/utils/constants";
import { BLACK_COLOR, WOOD_COLOR } from "@/utils/colors";

interface BoosterProps {
  item: BoosterPosition;
}

export const Booster: React.FC<BoosterProps> = ({ item }) => {
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
      style={{
        ...CARD_STYLES.container,
        textAlign: "center",
        padding: "1vw",
      }}
    >
      <div style={{ fontSize: "1.2em", color: BLACK_COLOR }}>{name}</div>
      <div style={{ fontSize: "0.8em", color: WOOD_COLOR }}>{description}</div>
    </div>
  );
};
