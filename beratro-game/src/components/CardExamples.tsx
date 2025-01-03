/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useState, useEffect } from "react";

interface CardPosition {
  id: number;
  suit: string;
  rank: string;
}

const cardRanks = {
  Ace: 14,
  King: 13,
  Queen: 12,
  Jack: 11,
  "10": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
} as const;

const suitOrder = {
  Hearts: 1,
  Diamonds: 2,
  Clubs: 3,
  Spades: 4,
} as const;

const DraggableCard = ({
  id,
  suit,
  rank,
  isSelected,
  onSelect,
}: CardPosition & {
  isSelected: boolean;
  onSelect: (id: number) => void;
}) => {
  const suitSymbol = {
    Hearts: "♥️",
    Spades: "♠️",
    Diamonds: "♦️",
    Clubs: "♣️",
  }[suit];

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <Reorder.Item
      value={id}
      id={id.toString()}
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
        color: ["Hearts", "Diamonds"].includes(suit) ? "red" : "black",
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
      <div style={{ fontSize: "32px" }}>{suitSymbol}</div>
    </Reorder.Item>
  );
};

export const CardExamples = () => {
  const [cards, setCards] = useState<CardPosition[]>([
    { id: 1, suit: "Hearts", rank: "Ace" },
    { id: 2, suit: "Spades", rank: "King" },
    { id: 3, suit: "Diamonds", rank: "Queen" },
    { id: 4, suit: "Clubs", rank: "Jack" },
    { id: 5, suit: "Hearts", rank: "10" },
  ]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  useEffect(() => {
    const handleClickOutside = () => {
      // Close any open card actions
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        const instance = card as any;
        if (instance.setIsSelected) {
          instance.setIsSelected(false);
        }
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const sortByValue = () => {
    setCards((prevCards) => {
      const sortedCards = [...prevCards].sort((a, b) => {
        return (
          (cardRanks[b.rank as keyof typeof cardRanks] || 0) -
          (cardRanks[a.rank as keyof typeof cardRanks] || 0)
        );
      });
      return sortedCards;
    });
  };

  const sortBySuit = () => {
    setCards((prevCards) => {
      const sortedCards = [...prevCards].sort((a, b) => {
        const suitCompare =
          (suitOrder[a.suit as keyof typeof suitOrder] || 0) -
          (suitOrder[b.suit as keyof typeof suitOrder] || 0);
        if (suitCompare === 0) {
          return (
            (cardRanks[b.rank as keyof typeof cardRanks] || 0) -
            (cardRanks[a.rank as keyof typeof cardRanks] || 0)
          );
        }
        return suitCompare;
      });
      return sortedCards;
    });
  };

  const handleReorder = (newOrder: number[]) => {
    const reorderedCards = newOrder.map(
      (id) => cards.find((card) => card.id === id)!
    );
    setCards(reorderedCards);
  };

  const handleSelect = (id: number) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const handleAction = (action: "play" | "discard") => {
    console.log(
      `${action} cards:`,
      cards.filter((card) => selectedCards.includes(card.id))
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
        as="ul"
        values={cards.map((card) => card.id)}
        onReorder={handleReorder}
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
          {cards.map((card) => (
            <DraggableCard
              key={card.id}
              {...card}
              isSelected={selectedCards.includes(card.id)}
              onSelect={handleSelect}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
};
