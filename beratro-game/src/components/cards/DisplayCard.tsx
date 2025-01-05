import { CardPosition } from "@/types/cards";
import { CardSuit, SUIT_SYMBOLS } from "@/utils/constants";
import { cardStyle } from "./styles";

const DisplayCard = ({ card }: { card: CardPosition }) => {
  return (
    <div
      style={{
        ...cardStyle,
        color: [CardSuit.HEARTS, CardSuit.DIAMONDS].includes(card.suit)
          ? "red"
          : "black",
      }}
    >
      <div>{card.rank}</div>
      <div style={{ fontSize: "32px" }}>{SUIT_SYMBOLS[card.suit]}</div>
    </div>
  );
};

export default DisplayCard;
