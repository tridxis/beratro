import "./App.css";
import Beras from "./components/Beras";
import { Game } from "./components/Game";
import { useGameStore } from "./store/gameStore";
import { GameState } from "./types/games";

function App() {
  const { currentState } = useGameStore();
  return currentState === GameState.BERAS_PICKING ? <Beras /> : <Game />;
}

export default App;
