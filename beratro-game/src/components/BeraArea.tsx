import { vibrateAnimation, hoverScaleAnimation } from "@/utils/animations";
import { BERA_STATS, BeraType } from "@/utils/beraStats";
import { STICKER_STATS } from "@/utils/stickerStats";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import {
  TopSection,
  DeckContainer,
  ShopItem,
  StickerItem,
  BottomButtonContainer,
  SellButton,
  DeckDescription,
} from "./Game.styles";
import { BeraPosition } from "@/types/beras";
import { Breakdown } from "@/types/hands";
import { GameStore } from "@/types/games";

interface BeraAreaProps {
  state: GameStore;
  handleTooltip: (
    show: boolean,
    content?: React.ReactNode,
    event?: React.MouseEvent,
    position?: "top" | "bottom" | "right"
  ) => void;
  currentBreakdown: Breakdown | null;
  renderBreakdownBera: (bera: BeraPosition) => React.ReactNode;
  sellBera: (beraId: string) => void;
}
const BeraArea = ({
  state,
  handleTooltip,
  currentBreakdown,
  renderBreakdownBera,
  sellBera,
}: BeraAreaProps) => {
  return (
    <TopSection flex={2}>
      <DeckContainer>
        {state.playingBeras.map((bera, index) => (
          <ShopItem
            key={`playing-bera-${index}`}
            className="bera-item"
            as={motion.div}
            whileHover="hover"
            variants={{
              ...vibrateAnimation,
              ...hoverScaleAnimation,
            }}
            style={{ position: "relative" }}
            animate={
              currentBreakdown?.beras.includes(bera.id.toString())
                ? "animate"
                : "initial"
            }
            onClick={(e) => {
              e.stopPropagation();
              state.setSelectedBera(
                state.selectedBera === bera.id ? null : bera.id
              );
            }}
            onMouseEnter={(e) => {
              handleTooltip(
                true,
                <>
                  {BERA_STATS[bera.bera].description.replace(
                    "{{value}}",
                    BERA_STATS[bera.bera].values[0].toString()
                  )}
                  {BERA_STATS[bera.bera].cumulative && (
                    <>
                      (Current:{" "}
                      {BERA_STATS[bera.bera].type === BeraType.MUL_MULT
                        ? "×"
                        : "+"}
                      {BERA_STATS[bera.bera].trigger(
                        BERA_STATS[bera.bera].values[0],
                        [],
                        state
                      )}
                      )
                    </>
                  )}
                </>,
                e,
                "bottom"
              );
            }}
            onMouseLeave={() => handleTooltip(false)}
          >
            {!!bera.sticker && (
              <StickerItem>{STICKER_STATS[bera.sticker].emoji}</StickerItem>
            )}
            {BERA_STATS[bera.bera].name}
            <br />
            Bera
            {renderBreakdownBera(bera)}
            <AnimatePresence>
              {state.selectedBera === bera.id && (
                <BottomButtonContainer
                  as={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <SellButton
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      sellBera(bera.id);
                    }}
                  >
                    Sell
                  </SellButton>
                </BottomButtonContainer>
              )}
            </AnimatePresence>
          </ShopItem>
        ))}
      </DeckContainer>
      <DeckDescription>{state.playingBeras.length}/5</DeckDescription>
    </TopSection>
  );
};

export default BeraArea;
