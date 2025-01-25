import React from "react";
import { CARD_STYLES } from "@/utils/cardStyles";
import { BoosterPosition } from "@/types/cards";

interface BoosterProps {
  item: BoosterPosition;
}

export const Booster: React.FC<BoosterProps> = ({ item }) => {
  const { booster } = item;

  return (
    <div
      style={{
        ...CARD_STYLES.container,
      }}
    >
      {booster}
    </div>
  );
};
