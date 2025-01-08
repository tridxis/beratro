import { useGameStore } from "@/store/gameStore";
import { GameState } from "@/types/games";
import React from "react";

const Beras = () => {
  const { setCurrentState } = useGameStore();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Beras This Game
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, calc(5vw + 32px))",
          gridTemplateRows: "repeat(2, calc(8vw + 32px))",
          gap: "16px",
          marginBottom: "16px",
          overflowX: "auto",
        }}
      >
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            style={{
              width: "5vw",
              height: "8vw",
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              backgroundColor: "white",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "500", color: "#000" }}>
              Bera #{index + 1}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setCurrentState(GameState.PLAYING);
        }}
        style={{
          padding: "8px 24px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default Beras;
