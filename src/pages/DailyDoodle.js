import { Canvas } from "../canvas/Canvas";
import { CanvasProvider } from "../canvas/CanvasContext";
import { ClearCanvasButton } from "../canvas/ClearCanvas";
import RandomWords from "../components/layout/RandomWords";

function DailyDoodle() {
  return (
    // can you nest everything under a setTimeout thing for the timer? 
    // also need an initial delay (maybe should let them choose from 3 options...)
    <CanvasProvider>
      <Canvas />
      <ClearCanvasButton />
    </CanvasProvider>
  );
}

export default DailyDoodle;
