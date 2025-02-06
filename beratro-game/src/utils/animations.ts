import { ANIMATION_MS } from "./constants";

// Update the vibration animation to include rotation
export const vibrateAnimation = {
  initial: { x: 0, y: 0, rotate: 0, transformOrigin: "center center" },
  animate: {
    x: [
      0,
      "-0.4vw",
      "0.4vw",
      "-0.3vw",
      "0.3vw",
      "-0.2vw",
      "0.2vw",
      "-0.1vw",
      "0.1vw",
      0,
    ],
    y: [
      0,
      "0.4vw",
      "-0.4vw",
      "0.3vw",
      "-0.3vw",
      "0.2vw",
      "-0.2vw",
      "0.1vw",
      "-0.1vw",
      0,
    ],
    rotate: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0],
    transformOrigin: "center center",
    transition: {
      duration: ANIMATION_MS / 3000, // Even faster duration
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
      ease: "easeOut", // Changed to easeOut for Balatro-like decay
      repeat: 0, // Single shake that decays
    },
  },
};

// Update the hover scale animation to maintain z-index
export const hoverScaleAnimation = {
  initial: {
    scale: 1,
    transformOrigin: "center center",
  },
  hover: {
    scale: 1.05,
    transformOrigin: "center center",
    transition: {
      duration: ANIMATION_MS / 2000,
      ease: "easeOut",
    },
  },
};
