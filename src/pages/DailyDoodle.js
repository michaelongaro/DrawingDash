import { CanvasProvider } from "../canvas/CanvasContext";
import { Canvas } from "../canvas/Canvas";
import Controls from "../canvas/Controls";
import RandomWords from "../components/layout/RandomWords";


function DailyDoodle() {
  return (
    // also need an initial delay (maybe should let them choose from 3 options...)
    <CanvasProvider>
      <RandomWords />
      <Canvas />
      <Controls />
    </CanvasProvider>
  );
}

export default DailyDoodle;
