import { useGameStore } from "@/store/gameStore";
import { Calculator } from "@/utils/calculator";
import React from "react";

const useCalculator = () => {
  const state = useGameStore((state) => state);

  const play = () => {
    return Calculator.calculate(state, { breakdown: true });
  };
  return { play };
};

export default useCalculator;
