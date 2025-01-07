import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { DisplayCard } from "./cards/DisplayCard";
import DraggableCard from "./cards/DraggableCard";
import { Calculator } from "@/utils/calculator";
import { HandType } from "@/utils/constants";
import { PokerHand } from "@/types/hands";
import { useMotionValue, useTransform, animate } from "framer-motion";
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
          }, index * 360); // Show each card's score 200ms apart
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
        }, playedCards.length * (scoredCards[0].chips.length + scoredCards[0].mults.length) * 360 + 360);
      }, playedCards.length * 360 + 360); // Wait for all card scores to show

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

  const useAnimatedCounter = (value: number) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
      const controls = animate(count, value, {
        type: "tween",
        duration: 0.1,
        ease: "easeOut",
      });

      return controls.stop;
    }, [value]);

    return rounded;
  };

  return (
    <div
      style={{
        backgroundColor: "#1a472a",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          width: "300px",
          background: "rgba(0,0,0,0.8)",
          padding: "20px",
        }}
      >
        {/* Reset Button */}
        <button
          onClick={() => {
            reset();
            dealCards();
          }}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#9e9e9e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#858585")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#9e9e9e")
          }
        >
          Reset
        </button>

        {/* Big Blind Box */}
        <div
          style={{
            backgroundColor: "#8B4513",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              padding: "10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: "#704214",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Big Blind
          </div>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#2C3E50",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          >
            <div style={{ color: "white" }}>Score at least</div>
            <div style={{ fontSize: "32px", color: "#FF4444" }}>1,200</div>
            <div style={{ color: "#FFD700" }}>to earn $$$$</div>
          </div>
        </div>

        {/* Round Score */}
        <div
          style={{
            backgroundColor: "#2C3E50",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <div style={{ color: "white" }}>Round score</div>
          <div style={{ fontSize: "32px", color: "white" }}>{score}</div>
        </div>

        {/* Two Pair Info */}
        <div
          style={{
            backgroundColor: "#2C3E50",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <div style={{ color: "white", marginBottom: "5px" }}>
            {pokerHandRef.current?.handType}
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              fontWeight: "bold",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              style={{
                backgroundColor: "#3498db",
                padding: "5px 10px",
                borderRadius: "4px",
                color: "white",
                display: "inline-block",
              }}
            >
              {useAnimatedCounter(
                (pokerHandRef.current?.chips || 0) +
                  Object.keys(cardScores).reduce(
                    (sum: number, card: string) =>
                      sum +
                      cardScores[Number(card)].chips.reduce(
                        (sum: number, chip: number) => sum + chip,
                        0
                      ),
                    0
                  )
              )}
            </motion.div>
            ×
            <span
              style={{
                backgroundColor: "#e74c3c",
                padding: "5px 10px",
                borderRadius: "4px",
                color: "white",
              }}
            >
              {pokerHandRef.current?.mult || 0}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "#2C3E50",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ color: "white" }}>Hands</div>
            <div
              style={{ color: "#3498db", fontSize: "24px", fontWeight: "bold" }}
            >
              {maxHands - playedHands.length}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#2C3E50",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ color: "white" }}>Discards</div>
            <div
              style={{ color: "#e74c3c", fontSize: "24px", fontWeight: "bold" }}
            >
              {maxDiscards - discards.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Deck Area - Top Right */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            height: "180px",
          }}
        ></div>

        {/* Played Hand Area */}
        <div
          style={{
            minHeight: "180px",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          {playedHands.map((hand, handIndex) => (
            <div
              key={handIndex}
              style={{
                position: "relative",
                opacity: handIndex === lastPlayedIndex ? 1 : 0,
                display: handIndex === lastPlayedIndex ? "block" : "none",
              }}
            >
              <div
                style={{
                  padding: "4px",
                  display: "flex",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  transform:
                    handIndex === lastPlayedIndex ? "scale(1.05)" : "scale(1)",
                }}
              >
                {hand.map((card, index) => (
                  <div
                    key={card.id}
                    style={{
                      marginLeft: index > 0 ? "20px" : "0",
                      position: "relative",
                      zIndex: index,
                    }}
                  >
                    <DisplayCard card={card} />
                    {cardScores[card.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          position: "absolute",
                          top: "-40px",
                          left: "50%",
                          width: "fit-content",
                          transform: "translateX(-50%)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {cardScores[card.id].chips.map((chip, i) => (
                          <div
                            key={i}
                            style={{
                              background: "#0092ff",
                              padding: "10px",
                              color: "#fff",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          >
                            +{chip}
                          </div>
                        ))}
                        {cardScores[card.id].mults.map((mult, i) => (
                          <div
                            key={i}
                            style={{
                              background: "#0092ff",
                              padding: "10px",
                              color: "#fff",
                              fontSize: "12px",
                            }}
                          >
                            ×{mult}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hand Cards Area */}
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: "10px",
            marginTop: "auto",
          }}
        >
          <Reorder.Group
            axis="x"
            values={handCards.map((card) => card.id)}
            onReorder={reorderCards}
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              minHeight: "100px",
              listStyle: "none",
              margin: "0 auto",
              width: "fit-content",
            }}
          >
            <AnimatePresence mode="popLayout" initial={true}>
              {handCards.map((card, index) => (
                <div
                  key={card.id}
                  style={{
                    marginLeft:
                      index > 0
                        ? `-${Math.min(10 + handCards.length, 10)}px`
                        : "0", // Adaptive negative margin
                    position: "relative",
                    // zIndex: selectedCards.includes(card.id) ? 100 : index, // Selected cards appear on top
                  }}
                >
                  <DraggableCard
                    className="hand-card"
                    card={card}
                    isSelected={selectedCards.includes(card.id)}
                    onSelect={toggleSelectedCard}
                  />
                </div>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={sortByValue}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Sort Value
          </button>
          <button
            onClick={sortBySuit}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Sort Suit
          </button>
          {selectedCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: "flex", gap: "10px" }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction("play")}
                disabled={playedHands.length >= maxHands}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    playedHands.length >= maxHands ? "#95a5a6" : "#e67e22",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    playedHands.length >= maxHands ? "not-allowed" : "pointer",
                }}
              >
                Play
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction("discard")}
                disabled={discards.length >= maxDiscards}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    discards.length >= maxDiscards ? "#95a5a6" : "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    discards.length >= maxDiscards ? "not-allowed" : "pointer",
                }}
              >
                Discard
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
