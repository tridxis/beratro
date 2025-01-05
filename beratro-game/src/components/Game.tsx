import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import DisplayCard from "./cards/DisplayCard";
import DraggableCard from "./cards/DraggableCard";
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
    discards,
    maxHands,
    maxDiscards,
  } = useGameStore();

  const [lastPlayedIndex, setLastPlayedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (handCards.length === 0) {
      dealCards();
    }
  }, []);

  console.log(playedHands);
  console.log(handCards);

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
      setLastPlayedIndex(playedHands.length);
      setTimeout(() => {
        setLastPlayedIndex(null);
      }, 5000);
    } else {
      if (discards.length >= maxDiscards) {
        alert(`Maximum of ${maxDiscards} discards reached!`);
        return;
      }
      discardSelectedCards();
    }
    dealCards();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
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
                <DisplayCard key={card.id} card={card} />
              ))}
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
