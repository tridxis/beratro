import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useEffect, useRef } from "react";
import { useCardStore } from "@/store/cardStore";
import { CardPosition } from "@/types/cards";
import { CardSuit, SUIT_SYMBOLS } from "@/utils/constants";
import { Calculator } from "@/utils/calculator";

const DraggableCard = ({
  card: { id, suit, rank },
  isSelected,
  onSelect,
}: {
  card: CardPosition;
  isSelected: boolean;
  onSelect: (id: number) => void;
  className: string;
}) => {
  const isDragging = useRef(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging.current) {
      onSelect(id);
    }
  };

  return (
    <Reorder.Item
      value={id}
      id={id.toString()}
      onDragStart={() => {
        isDragging.current = true;
      }}
      onDragEnd={() => {
        isDragging.current = false;
      }}
      initial={{ x: 300, opacity: 0 }}
      animate={{
        x: 0,
        y: isSelected ? -50 : 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          // delay: !isSelected && id * 0.1,
        },
      }}
      exit={{ x: -300, opacity: 0 }}
      style={{
        padding: "20px",
        margin: "10px",
        backgroundColor: "white",
        border: `2px solid ${isSelected ? "#4CAF50" : "black"}`,
        borderRadius: "10px",
        cursor: "grab",
        width: "80px",
        height: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "24px",
        color: [CardSuit.HEARTS, CardSuit.DIAMONDS].includes(suit)
          ? "red"
          : "black",
        userSelect: "none",
        position: "relative",
        zIndex: isSelected ? 4 : "auto",
      }}
      whileDrag={{
        cursor: "grabbing",
        scale: 1.05,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.25)",
        zIndex: 3,
      }}
      onClick={handleCardClick}
      transition={{
        duration: 0.1,
      }}
    >
      <div>{rank}</div>
      <div style={{ fontSize: "32px" }}>{SUIT_SYMBOLS[suit]}</div>
    </Reorder.Item>
  );
};

export const CardExamples = () => {
  const {
    handCards,
    selectedCards,
    sortByValue,
    sortBySuit,
    reorderCards,
    toggleSelectedCard,
    setSelectedCards,
    reset,
    dealCards,
  } = useCardStore();

  useEffect(() => {
    if (handCards.length === 0) {
      dealCards();
    }
  }, []);

  if (handCards.length > 0) {
    console.log(handCards);
    const score = Calculator.calculateScore(handCards);
    console.log(score);
  }

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
    console.log(
      `${action} handCards:`,
      handCards.filter((card) => selectedCards.includes(card.id))
    );
    setSelectedCards([]);
  };

  return (
    <div style={{ padding: "20px" }}>
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
          Sort by Value
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
          Sort by Suit
        </button>

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
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Play Selected ({selectedCards.length})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction("discard")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Discard Selected ({selectedCards.length})
            </motion.button>
          </motion.div>
        )}
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
    </div>
  );
};
