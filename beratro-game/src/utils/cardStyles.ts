import { BORDER_COLOR, WHITE_COLOR } from "./colors";

export const CARD_STYLES = {
  container: {
    width: "8vw",
    height: "12vw",
    border: `0.1vw solid ${BORDER_COLOR}`,
    borderRadius: "0.5vw",
    backgroundColor: WHITE_COLOR,
    color: BORDER_COLOR,
    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    transition: "box-shadow 0.2s ease-in-out",
  },
  topRank: {
    position: "absolute",
    top: "0.5vw",
    left: "0.5vw",
    fontSize: "1.2vw",
    lineHeight: "1.2vw",
    fontWeight: "bold",
  },
  suit: {
    fontSize: "2vw",
    lineHeight: "2w",
  },
  bottomRank: {
    position: "absolute",
    bottom: "0.5vw",
    right: "0.5vw",
    fontSize: "1.2vw",
    lineHeight: "1.2vw",
    fontWeight: "bold",
    transform: "rotate(180deg)",
  },
} as const;
