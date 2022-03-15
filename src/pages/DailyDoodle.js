import { CanvasProvider } from "../canvas/CanvasContext";
import { Canvas } from "../canvas/Canvas";

function DailyDoodle() {
  
  return (
    <CanvasProvider>
      <Canvas />
    </CanvasProvider>
  );
}

export default DailyDoodle;
