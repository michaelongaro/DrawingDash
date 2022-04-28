import { createContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

import {
  getDatabase,
  ref,
  set,
  child,
  get,
  onValue,
  update,
} from "firebase/database";

import { app } from "../util/init-firebase";

const DrawingSelectionContext = createContext(null);

export function DrawingSelectionProvider(props) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));

  const [seconds, setSeconds] = useState(0);
  const [chosenPrompt, setChosenPrompt] = useState("");
  const [drawingTime, setDrawingTime] = useState(0);
  const [buttonAvailability, setButtonAvailability] = useState([
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
  const [currentCursorSize, setCurrentCursorSize] = useState(5);
  const [currentColor, setCurrentColor] = useState("white");

  const [fetchNewWords, setFetchNewWords] = useState(true);

  const [showPromptSelection, setShowPromptSelection] = useState(true);
  const [showPaletteChooser, setShowPaletteChooser] = useState(false);
  const [showDrawingScreen, setShowDrawingScreen] = useState(false);

  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [showEndOutline, setShowEndOutline] = useState(false);

  // i hate doing this below
  const [drawingStatuses, setDrawingStatuses] = useState({
    60: false,
    180: false,
    300: false,
    extra: false,
  });
  const [dailyPrompts, setDailyPrompts] = useState({
    60: "",
    180: "",
    300: "",
  });
  const [extraPrompt, setExtraPrompt] = useState({
    seconds: 60,
    title: "",
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      onValue(ref(db, `dailyPrompts`), (snapshot) => {
        if (snapshot.exists()) {
          setDailyPrompts(snapshot.val());
        }
      });

      onValue(
        ref(db, `users/${user.sub}/completedDailyPrompts`),
        (snapshot) => {
          if (snapshot.exists()) {
            setDrawingStatuses(snapshot.val());
          }
        }
      );

      onValue(ref(db, `users/${user.sub}/extraDailyPrompt`), (snapshot) => {
        if (snapshot.exists()) {
          setExtraPrompt(snapshot.val());
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  function resetSelections() {
    setSeconds(0);
    setDrawingTime(0);
    setPaletteColors(["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]);

    setShowPaletteChooser(false);
    setShowDrawingScreen(false);
    setShowEndOverlay(false);
    setShowEndOutline(false);
    setShowPromptSelection(true);
  }

  function goBackToPromptSelection() {
    setDrawingTime(0);
    setShowPaletteChooser(false);
    setShowPromptSelection(true);
  }

  function titleForPromptSelection() {
    if (
      showPromptSelection &&
      !showDrawingScreen &&
      buttonAvailability.includes(true)
    ) {
      return "A Drawing Prompt";
    } else if (
      !showPromptSelection &&
      showDrawingScreen &&
      !buttonAvailability.includes(true)
    ) {
      return "Come back tomorrow for more prompts";
    } else if (
      !showPromptSelection &&
      showDrawingScreen &&
      buttonAvailability.includes(true)
    ) {
      return "Time's Up! \nChoose Another Drawing";
    } else if (
      !showPromptSelection &&
      showDrawingScreen &&
      !buttonAvailability.includes(true)
    ) {
      return "Time's Up! \nCome back tomorrow for more prompts";
    }
  }

  const context = {
    seconds: seconds,
    setSeconds: setSeconds,
    drawingTime: drawingTime,
    chosenPrompt: chosenPrompt,
    setChosenPrompt: setChosenPrompt,
    setDrawingTime: setDrawingTime,
    buttonAvailability: buttonAvailability,
    setButtonAvailability: setButtonAvailability,

    drawingStatuses: drawingStatuses,
    dailyPrompts: dailyPrompts,
    extraPrompt: extraPrompt,
    paletteColors: paletteColors,
    setPaletteColors: setPaletteColors,
    currentCursorSize: currentCursorSize,
    setCurrentCursorSize: setCurrentCursorSize,
    currentColor: currentColor,
    setCurrentColor: setCurrentColor,
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
  };

  return (
    <DrawingSelectionContext.Provider value={context}>
      {props.children}
    </DrawingSelectionContext.Provider>
  );
}

export default DrawingSelectionContext;
