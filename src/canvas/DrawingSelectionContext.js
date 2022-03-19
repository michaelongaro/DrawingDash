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

  const [pushTimeout, setPushTimeout] = useState();
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

  // function getCompletedDrawingStatuses() {
  //   get(child(dbRef, `users/${user.sub}/completedDailyPrompts`)).then(
  //     (snapshot) => {
  //       if (snapshot.exists()) {
  //         setDrawingStatuses(snapshot.val());
  //       }
  //     }
  //   );
  // }

  // function getDailyPrompts() {
  //   get(child(dbRef, "dailyPrompts")).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       setDailyPrompts(snapshot.val());
  //     }
  //   });
  // }

  // function getUniquePrompt() {
  //   get(child(dbRef, `users/${user.sub}/extraDailyPrompt`)).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       if (!snapshot.val()["refresh"]) {
  //         setExtraPrompt(snapshot.val());
  //         return;
  //       }
  //     }
  //   });

  //   fetch("https://random-word-form.herokuapp.com/random/adjective")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       return data[0];
  //     })
  //     .then((adj) => {
  //       fetch("https://random-word-form.herokuapp.com/random/noun")
  //         .then((response) => response.json())
  //         .then((data2) => {
  //           return `${adj} ${data2[0]}`;
  //         })
  //         .then((fullTitle) => {
  //           const seconds = [60, 180, 300];
  //           const randomSeconds =
  //             seconds[Math.floor(Math.random() * seconds.length)];

  //           set(ref(db, `users/${user.sub}/extraDailyPrompt`), {
  //             seconds: randomSeconds,
  //             title: fullTitle,
  //             refresh: false,
  //           }).then(() => {
  //             setExtraPrompt({
  //               seconds: randomSeconds,
  //               title: fullTitle,
  //             });
  //           });
  //         });
  //     });
  // }

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
    // setDrawingStatuses: setDrawingStatuses,
    dailyPrompts: dailyPrompts,
    // setDailyPrompts: setDailyPrompts,
    extraPrompt: extraPrompt,
    // setExtraPrompt: setExtraPrompt,

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
    // finishedFetchingStatuses: finishedFetchingStatuses,
    // setFinishedFetchingStatuses: setFinishedFetchingStatuses,
    setShowEndOutline: setShowEndOutline,
    goBackToPromptSelection: goBackToPromptSelection,
    resetSelections: resetSelections,
    titleForPromptSelection: titleForPromptSelection,
    pushTimeout: pushTimeout,
    setPushTimeout: setPushTimeout,
    // resetLastClickedButton: resetLastClickedButton,
    // getCompletedDrawingStatuses: getCompletedDrawingStatuses,
    // getDailyPrompts: getDailyPrompts,
    // getUniquePrompt: getUniquePrompt,
  };

  return (
    <DrawingSelectionContext.Provider value={context}>
      {props.children}
    </DrawingSelectionContext.Provider>
  );
}

export default DrawingSelectionContext;
