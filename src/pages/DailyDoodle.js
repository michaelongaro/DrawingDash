import { CanvasProvider } from "../canvas/CanvasContext";
import { Canvas } from "../canvas/Canvas";
import Footer from "../ui/Footer";

function DailyDoodle() {
  
  return (
    <>
    <CanvasProvider>
      <Canvas />
    </CanvasProvider>
    <Footer />
    </>
  );
}

export default DailyDoodle;
