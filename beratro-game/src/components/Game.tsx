import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import DisplayCard from "./cards/DisplayCard";
import DraggableCard from "./cards/DraggableCard";
import { Calculator } from "@/utils/calculator";
import { HandType } from "@/utils/constants";
import { PokerHand } from "@/types/hands";
// import { Calculator } from "@/utils/calculator";

export const Game = () => {
  const {
    handCards,
    selectedCards,
    playedHands,
    sortByValue,
    sortBySuit,
    reorderCards,
    toggleSelectedCard,
    reset,
    dealCards,
    playSelectedCards,
    discardSelectedCards,
    score,
    addScore,
    discards,
    maxHands,
    maxDiscards,
  } = useGameStore();

  const [lastPlayedIndex, setLastPlayedIndex] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [cardScores, setCardScores] = useState<{
    [key: number]: {
      chips: number[];
      mults: number[];
    };
  }>({});

  const pokerHandRef = useRef<PokerHand | null>(null);

  useEffect(() => {
    if (handCards.length === 0) {
      dealCards();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      const handCards = document.querySelectorAll(".hand-card");
      handCards.forEach((card) => {
        const instance = card as unknown as {
          setIsSelected?: (isSelected: boolean) => void;
        };
        if (instance.setIsSelected) {
          instance.setIsSelected(false);
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAction = (action: "play" | "discard") => {
    if (action === "play") {
      if (playedHands.length >= maxHands) {
        alert(`Maximum of ${maxHands} played hands reached!`);
        return;
      }
      playSelectedCards();

      // Calculate score for the played hand
      const playedCards = selectedCards.map(
        (id) => handCards.find((card) => card.id === id)!
      );
      const { score, scoredCards, pokerHand } =
        Calculator.calculateScore(playedCards);

      // Animate individual card scores
      playedCards.forEach((card, index) => {
        if (scoredCards[index]) {
          setTimeout(() => {
            setCardScores((prev) => ({
              ...prev,
              [scoredCards[index].id]: {
                chips: scoredCards[index].chips,
                mults: scoredCards[index].mults,
              },
            }));
          }, index * 200); // Show each card's score 200ms apart
        }
      });

      pokerHandRef.current = pokerHand;

      // Update total score after all individual scores are shown
      setTimeout(() => {
        setCurrentScore(score);
        addScore(score);

        setCardScores({});
        // Clear individual scores and reset display after 5s
        setTimeout(() => {
          setCurrentScore(null);
          setLastPlayedIndex(null);
          pokerHandRef.current = null;
        }, playedCards.length * (scoredCards[0].chips.length + scoredCards[0].mults.length) * 200 + 2000);
      }, playedCards.length * 200 + 200); // Wait for all card scores to show

      setLastPlayedIndex(playedHands.length);
    } else {
      if (discards.length >= maxDiscards) {
        alert(`Maximum of ${maxDiscards} discards reached!`);
        return;
      }
      discardSelectedCards();
    }
    dealCards();
  };

  console.log(playedHands);
  console.log(cardScores);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            reset();
            dealCards();
          }}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#9e9e9e",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Reset
        </button>
        <div
          style={{
            fontSize: "1.2em",
            fontWeight: "bold",
            padding: "8px 16px",
            backgroundColor: "#ffd700",
            color: "#000",
            borderRadius: "4px",
          }}
        >
          Score: {score}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>
          Played Hands: ({playedHands.length}/{maxHands})
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            minHeight: "180px",
          }}
        >
          {lastPlayedIndex !== null && playedHands[lastPlayedIndex] && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ffd700",
                  borderRadius: "8px",
                  display: "flex",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
                  transform: "scale(1.05)",
                  animation: "fadeIn 0.3s ease-in",
                }}
              >
                {playedHands[lastPlayedIndex].map((card) => (
                  <div key={card.id} style={{ position: "relative" }}>
                    <DisplayCard card={card} />
                    {cardScores[card.id] !== undefined && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          pointerEvents: "none",
                        }}
                      >
                        {/* Show chips first */}
                        {cardScores[card.id].chips.map((chip, index) => (
                          <motion.div
                            key={`chip-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            style={{
                              background: "#ffd700",
                              padding: "2px 6px",
                              borderRadius: "10px",
                              fontSize: "0.8em",
                              fontWeight: "bold",
                              color: "#000",
                              whiteSpace: "nowrap",
                            }}
                          >
                            +{chip}
                          </motion.div>
                        ))}
                        {/* Show multipliers after chips */}
                        {cardScores[card.id].mults.map((mult, index) => (
                          <motion.div
                            key={`mult-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay:
                                (cardScores[card.id].chips.length + index) *
                                0.2,
                            }}
                            style={{
                              background: "#ff4081",
                              padding: "2px 6px",
                              borderRadius: "10px",
                              fontSize: "0.8em",
                              fontWeight: "bold",
                              color: "#fff",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ×{mult}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {!!pokerHandRef.current && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay:
                      playedHands[lastPlayedIndex].length *
                      (Object.values(cardScores)[0]?.chips.length +
                        Object.values(cardScores)[0]?.mults.length) *
                      0.2,
                  }}
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-10px",
                    background: "#4a148c",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    color: "#fff",
                    fontWeight: "bold",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <span>{pokerHandRef.current?.handType}</span>
                  {pokerHandRef.current?.chips &&
                    pokerHandRef.current?.chips > 0 && (
                      <span
                        style={{
                          background: "#ffd700",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          color: "#000",
                        }}
                      >
                        +{pokerHandRef.current?.chips}
                      </span>
                    )}
                  {pokerHandRef.current?.mult &&
                    pokerHandRef.current?.mult > 0 && (
                      <span
                        style={{
                          background: "#ff4081",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          color: "#fff",
                        }}
                      >
                        ×{pokerHandRef.current?.mult}
                      </span>
                    )}
                  {currentScore !== null && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay:
                          playedHands[lastPlayedIndex].length *
                            (Object.values(cardScores)[0]?.chips.length +
                              Object.values(cardScores)[0]?.mults.length) *
                            0.2 +
                          0.2, // Add slight additional delay
                        duration: 0.3,
                      }}
                      style={{
                        background: "#ffd700",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        color: "#000",
                        marginLeft: "4px",
                      }}
                    >
                      +{currentScore} points
                    </motion.span>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

        <h3>
          Discards: ({discards.length}/{maxDiscards})
        </h3>
        {/* ... existing discards code ... */}
      </div>

      <Reorder.Group
        axis="x"
        values={handCards.map((card) => card.id)}
        onReorder={reorderCards}
        style={{
          display: "flex",
          padding: "20px",
          width: "100%",
          listStyle: "none",
          gap: "10px",
          overflowX: "auto",
          alignItems: "center",
          minHeight: "300px",
          background: "#f0f0f0",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <AnimatePresence mode="popLayout" initial={true}>
          {handCards.map((card) => (
            <DraggableCard
              className="hand-card"
              key={card.id}
              card={card}
              isSelected={selectedCards.includes(card.id)}
              onSelect={toggleSelectedCard}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button
          onClick={sortByValue}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Rank Sort
        </button>
        <button
          onClick={sortBySuit}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Suit Sort
        </button>

        {selectedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction("play")}
              disabled={playedHands.length >= maxHands}
              style={{
                padding: "8px 16px",
                backgroundColor:
                  playedHands.length >= maxHands ? "#cccccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  playedHands.length >= maxHands ? "not-allowed" : "pointer",
              }}
            >
              Play Selected ({selectedCards.length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction("discard")}
              disabled={discards.length >= maxDiscards}
              style={{
                padding: "8px 16px",
                backgroundColor:
                  discards.length >= maxDiscards ? "#cccccc" : "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor:
                  discards.length >= maxDiscards ? "not-allowed" : "pointer",
              }}
            >
              Discard Selected ({selectedCards.length})
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
