import "./App.css";
import StartingBeras from "./components/StartingBeras";
import Game from "./components/Game";
import { useGameStore } from "./store/gameStore";
import { GameState } from "./types/games";

function App() {
  const { currentState } = useGameStore();
  return currentState === GameState.BERAS_PICKING ? (
    <StartingBeras />
  ) : (
    <Game />
  );
}

export default App;
