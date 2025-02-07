import { vibrateAnimation, hoverScaleAnimation } from "@/utils/animations";
import { BERA_STATS, BeraType } from "@/utils/beraStats";
import { STICKER_STATS } from "@/utils/stickerStats";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import React from "react";
import {
  TopSection,
  DeckContainer,
  ShopItem,
  StickerItem,
  BottomButtonContainer,
  SellButton,
  DeckDescription,
  ReorderGroup,
  CardSlot,
  MergeButton,
} from "./Game.styles";
import { BeraPosition } from "@/types/beras";
import { Breakdown } from "@/types/hands";
import { GameStore } from "@/types/games";
import { Stars } from "./Stars";

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
  const canMerge = (bera1: BeraPosition, bera2: BeraPosition) => {
    return (
      bera1.bera === bera2.bera &&
      bera1.level === bera2.level &&
      bera1.id !== bera2.id &&
      bera1.level < 3
    );
  };

  const handleBeraClick = (beraId: string) => {
    const selectedBera = state.playingBeras.find((b) => b.id === beraId);
    if (!selectedBera) return;

    if (state.selectedBeras.includes(beraId)) {
      state.setSelectedBeras([]);
      return;
    }

    // If this is first selection or can't merge with currently selected, just select this one
    if (state.selectedBeras.length === 0) {
      state.setSelectedBeras([beraId]);
      return;
    }

    // Check if can merge with any currently selected bera
    const otherBera = state.playingBeras.find((b) =>
      state.selectedBeras.includes(b.id)
    );
    if (otherBera && canMerge(selectedBera, otherBera)) {
      state.setSelectedBeras([...state.selectedBeras, beraId]);
    } else {
      state.setSelectedBeras([beraId]);
    }
  };

  return (
    <TopSection flex={2}>
      <DeckContainer>
        <ReorderGroup
          axis="x"
          values={state.playingBeras}
          onReorder={(newOrder) =>
            state.reorderBeras(newOrder as BeraPosition[])
          }
        >
          {state.playingBeras.map((bera) => (
            <CardSlot
              key={bera.id}
              index={bera.index}
              totalCards={state.playingBeras.length}
            >
              <Reorder.Item
                key={bera.id}
                value={bera}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
                // dragListener={!state.selectedBera}
              >
                <ShopItem
                  className="bera-item"
                  as={motion.div}
                  whileHover="hover"
                  variants={{
                    ...vibrateAnimation,
                    ...hoverScaleAnimation,
                  }}
                  style={{ position: "relative", cursor: "grab" }}
                  animate={
                    currentBreakdown?.beras.includes(bera.id.toString())
                      ? "animate"
                      : "initial"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeraClick(bera.id);
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
                    <StickerItem>
                      {STICKER_STATS[bera.sticker].emoji}
                    </StickerItem>
                  )}
                  {BERA_STATS[bera.bera].name}
                  <br />
                  Bera
                  <Stars level={bera.level} />
                  {renderBreakdownBera(bera)}
                  <AnimatePresence>
                    {state.selectedBeras.includes(bera.id) && (
                      <BottomButtonContainer
                        as={motion.div}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {state.selectedBeras.length === 2 && (
                          <MergeButton
                            as={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const otherBeraId = state.selectedBeras.find(
                                (id) => id !== bera.id
                              );
                              if (otherBeraId) {
                                state.mergeBeras(bera.id, otherBeraId);
                                state.setSelectedBeras([]);
                              }
                            }}
                          >
                            Merge
                          </MergeButton>
                        )}
                        {state.selectedBeras.length === 1 && (
                          <SellButton
                            as={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              sellBera(bera.id);
                              state.setSelectedBeras(
                                state.selectedBeras.filter(
                                  (id) => id !== bera.id
                                )
                              );
                            }}
                          >
                            Sell
                          </SellButton>
                        )}
                      </BottomButtonContainer>
                    )}
                  </AnimatePresence>
                </ShopItem>
              </Reorder.Item>
            </CardSlot>
          ))}
        </ReorderGroup>
      </DeckContainer>
      <DeckDescription>{state.playingBeras.length}/5</DeckDescription>
    </TopSection>
  );
};

export default BeraArea;
