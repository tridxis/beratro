export const CARD_STYLES = {
  container: {
    width: "8vw",
    height: "13vw",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "white",
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
    top: "10px",
    left: "10px",
    fontSize: "20px",
    lineHeight: "20px",
    fontWeight: "bold",
  },
  suit: {
    fontSize: "40px",
    lineHeight: "40px",
  },
  bottomRank: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    fontSize: "20px",
    lineHeight: "20px",
    fontWeight: "bold",
    transform: "rotate(180deg)",
  },
} as const;
