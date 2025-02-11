import { motion } from "framer-motion";
import { CardPosition, BoosterPosition } from "@/types/cards";
import {
  BOOSTER_PACK_INFO,
  BOOSTER_PACKS,
  BoosterPack,
  Flower,
  HAND_NAMES,
  Meme,
  Sticker,
} from "@/utils/constants";
import { BeraPosition } from "@/types/beras";
import { BERA_STATS } from "@/utils/beraStats";
import {
  ShopContainer,
  ShopSection,
  ShopItemGrid,
  ShopButtonGrid,
  ShopButton,
  ShopItem,
  PriceTag,
  BuyButton,
  CardRow,
  CardWrapper,
  SkipButton,
  ShopItemsGrid,
  EmptyItem,
} from "../Game.styles";
import { DisplayCard } from "../cards/DisplayCard";
import { Booster } from "../cards/Booster";
import { FLOWER_STATS } from "@/utils/flowerStats";
import { MEME_STATS } from "@/utils/memeStats";
import { STICKER_STATS } from "@/utils/stickerStats";

interface ShoppingStateProps {
  selectedPack: {
    boosterPack: BoosterPack;
    items: (CardPosition | BoosterPosition)[];
    pickedItems: string[];
  } | null;
  shopBeras: BeraPosition[];
  gold: number;
  boughtPacks: { [key in BoosterPack]: boolean };
  handleTooltip: (
    show: boolean,
    content?: React.ReactNode,
    event?: React.MouseEvent,
    position?: "top" | "bottom" | "right"
  ) => void;
  getCardTooltipContent: (card: CardPosition) => React.ReactNode;
  buyBera: (id: string) => void;
  buyPack: (pack: BoosterPack) => void;
  pickItemFromPack: (item: CardPosition | BoosterPosition) => void;
  nextRound: () => void;
  dealCards: () => void;
  skipPack: () => void;
  rerollCost: number;
  rerollShopBeras: () => void;
}

export const ShoppingState = ({
  selectedPack,
  shopBeras,
  gold,
  boughtPacks,
  handleTooltip,
  getCardTooltipContent,
  buyBera,
  buyPack,
  pickItemFromPack,
  nextRound,
  dealCards,
  skipPack,
  rerollCost,
  rerollShopBeras,
}: ShoppingStateProps) => {
  return (
    <ShopContainer>
      {!selectedPack ? (
        <ShopItemsGrid>
          <ShopSection>
            <ShopItemGrid>
              <ShopButtonGrid>
                <ShopButton
                  variant="primary"
                  onClick={() => {
                    nextRound();
                    dealCards();
                  }}
                >
                  Next Round
                </ShopButton>
                <ShopButton
                  variant="secondary"
                  onClick={rerollShopBeras}
                  disabled={gold < rerollCost}
                >
                  Reroll ${rerollCost}
                </ShopButton>
              </ShopButtonGrid>

              {shopBeras.map((bera, index) => (
                <ShopItem
                  key={`pack-${index}`}
                  style={{ position: "relative" }}
                  onMouseEnter={(e) => {
                    handleTooltip(
                      true,
                      <>
                        {BERA_STATS[bera.bera].description.replace(
                          "{{value}}",
                          BERA_STATS[bera.bera].values[
                            bera.level - 1
                          ].toString()
                        )}
                      </>,
                      e,
                      "top"
                    );
                  }}
                  onMouseLeave={() => handleTooltip(false)}
                >
                  <PriceTag>${BERA_STATS[bera.bera]?.cost}</PriceTag>
                  {BERA_STATS[bera.bera]?.name}
                  <br />
                  Bera
                  <BuyButton
                    onClick={() => buyBera(bera.id)}
                    disabled={gold < BERA_STATS[bera.bera]?.cost}
                  >
                    Buy
                  </BuyButton>
                </ShopItem>
              ))}
            </ShopItemGrid>
          </ShopSection>

          <ShopSection>
            <ShopItemGrid>
              <div></div>
              {BOOSTER_PACKS.map((item, index) =>
                boughtPacks[item.type] ? (
                  <EmptyItem key={`pack-${index}`}></EmptyItem>
                ) : (
                  <ShopItem
                    key={`pack-${index}`}
                    style={{ position: "relative" }}
                    onMouseEnter={(e) => {
                      handleTooltip(
                        true,
                        <>
                          <div style={{ marginTop: "1vw" }}>
                            Contains {BOOSTER_PACK_INFO[item.type].items}
                            <br />
                            Pick {BOOSTER_PACK_INFO[item.type].pick} items
                          </div>
                        </>,
                        e,
                        "top"
                      );
                    }}
                    onMouseLeave={() => handleTooltip(false)}
                  >
                    <PriceTag>${item.price}</PriceTag>
                    {item.name}
                    <BuyButton
                      onClick={() => buyPack(item.type)}
                      disabled={gold < item.price}
                    >
                      Buy
                    </BuyButton>
                  </ShopItem>
                )
              )}
            </ShopItemGrid>
          </ShopSection>
        </ShopItemsGrid>
      ) : (
        <div>
          <h3>
            Please select {BOOSTER_PACK_INFO[selectedPack.boosterPack].pick}{" "}
            items below:
          </h3>
          <CardRow isLastPlayed={false}>
            {selectedPack.items
              .filter((item) => !selectedPack.pickedItems.includes(item.id))
              .map((item) => (
                <CardWrapper
                  totalCards={selectedPack.items.length}
                  key={item.id}
                  index={item.index}
                  onClick={() => pickItemFromPack(item)}
                >
                  {(item as BoosterPosition).booster ? (
                    <motion.div
                      style={{ position: "relative" }}
                      onMouseEnter={(e) => {
                        const booster = item as BoosterPosition;
                        handleTooltip(
                          true,
                          booster.boosterType === "flower"
                            ? `Upgrade ${
                                HAND_NAMES[
                                  FLOWER_STATS[booster.booster as Flower].hand
                                ]
                              } by 1 level`
                            : booster.boosterType === "sticker"
                            ? STICKER_STATS[booster.booster as Sticker]
                                .description
                            : MEME_STATS[booster.booster as Meme].description,
                          e,
                          "top"
                        );
                      }}
                      onMouseLeave={() => handleTooltip(false)}
                    >
                      <Booster item={item as BoosterPosition} />
                    </motion.div>
                  ) : (
                    <motion.div
                      style={{ position: "relative" }}
                      onMouseEnter={(e) => {
                        const content = getCardTooltipContent(
                          item as CardPosition
                        );
                        if (content) handleTooltip(true, content, e, "top");
                      }}
                      onMouseLeave={() => handleTooltip(false)}
                    >
                      <DisplayCard card={item as CardPosition} />
                    </motion.div>
                  )}
                </CardWrapper>
              ))}
          </CardRow>
          <SkipButton onClick={skipPack}>Skip Pack</SkipButton>
        </div>
      )}
    </ShopContainer>
  );
};
