import { createContext, useState } from "react";

const DrawingSelectionContext = createContext(null);

export function DrawingSelectionProvider(props) {
  const [seconds, setSeconds] = useState(0);
  const [drawingTime, setDrawingTime] = useState(0);
  const [buttonAvailabilty, setButtonAvailabilty] = useState([
    true,
    true,
    true,
  ]);
  const [paletteColors, setPaletteColors] = useState([
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
  ]);

  const [pushTimeout, setPushTimeout] = useState();
  const [fetchNewWords, setFetchNewWords] = useState(true);

  const [showPromptSelection, setShowPromptSelection] = useState(true);
  const [showPaletteChooser, setShowPaletteChooser] = useState(false);
  const [showDrawingScreen, setShowDrawingScreen] = useState(false);

  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [showEndOutline, setShowEndOutline] = useState(false);

  // const [progressMessageStyles, setProgressMessageStyles] = useState([true, false, false]);

  function resetSelections() {
    console.log(seconds, drawingTime);
    if (seconds > 0 || drawingTime > 0) {
      resetLastClickedButton();
    }

    setSeconds(0);
    setDrawingTime(0);
    setPaletteColors(["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]);

    setShowPromptSelection(true);
    setShowPaletteChooser(false);
    setShowDrawingScreen(false);
    setShowEndOverlay(false);
    setShowEndOutline(false);
  }

  function goBackToPromptSelection() {
    resetLastClickedButton();
    setDrawingTime(0);
    setShowPaletteChooser(false);
    setShowPromptSelection(true);
  }

  function resetLastClickedButton() {
    const shallowButtonAvailability = [...buttonAvailabilty];

    if (drawingTime === 60) {
      shallowButtonAvailability[0] = true;
    } else if (drawingTime === 180) {
      shallowButtonAvailability[1] = true;
    } else {
      shallowButtonAvailability[2] = true;
    }
    console.log(
      drawingTime,
      shallowButtonAvailability,
      "is what it should read"
    );
    setButtonAvailabilty(shallowButtonAvailability);
  }

  function titleForPromptSelection() {
    if (
      showPromptSelection &&
      !showDrawingScreen &&
      buttonAvailabilty.includes(true)
    ) {
      return "A Drawing Prompt";
    } else if (
      !showPromptSelection &&
      showDrawingScreen &&
      !buttonAvailabilty.includes(true)
    ) {
      return "Come back tomorrow for more prompts";
    } else if (
      !showPromptSelection &&
      showDrawingScreen &&
      buttonAvailabilty.includes(true)
    ) {
      return "Time's Up! \nChoose Another Drawing";
    } else if (
      !showPromptSelection &&
      showDrawingScreen &&
      !buttonAvailabilty.includes(true)
    ) {
      return "Time's Up! \nCome back tomorrow for more prompts";
    }
  }

  const context = {
    seconds: seconds,
    setSeconds: setSeconds,
    drawingTime: drawingTime,
    setDrawingTime: setDrawingTime,
    buttonAvailabilty: buttonAvailabilty,
    setButtonAvailabilty: setButtonAvailabilty,
    paletteColors: paletteColors,
    setPaletteColors: setPaletteColors,
    fetchNewWords: fetchNewWords,
    setFetchNewWords: setFetchNewWords,
    showPromptSelection: showPromptSelection,
    setShowPromptSelection: setShowPromptSelection,
    showPaletteChooser: showPaletteChooser,
    setShowPaletteChooser: setShowPaletteChooser,
    showDrawingScreen: showDrawingScreen,
    setShowDrawingScreen: setShowDrawingScreen,
    showEndOverlay: showEndOverlay,
    setShowEndOverlay: setShowEndOverlay,
    showEndOutline: showEndOutline,
    setShowEndOutline: setShowEndOutline,
    goBackToPromptSelection: goBackToPromptSelection,
    resetSelections: resetSelections,
    titleForPromptSelection: titleForPromptSelection,
    pushTimeout: pushTimeout,
    setPushTimeout: setPushTimeout,
    resetLastClickedButton: resetLastClickedButton,
  };

  return (
    <DrawingSelectionContext.Provider value={context}>
      {props.children}
    </DrawingSelectionContext.Provider>
  );
}

export default DrawingSelectionContext;
