import { createContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

import isEqual from "lodash/isEqual";

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
  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const [fetchNewWords, setFetchNewWords] = useState(true);

  const [showPromptSelection, setShowPromptSelection] = useState(true);
  const [showPaletteChooser, setShowPaletteChooser] = useState(false);
  const [showDrawingScreen, setShowDrawingScreen] = useState(false);

  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [showEndOutline, setShowEndOutline] = useState(false);

  const [animateExtraPromptsContainer, setAnimateExtraPromptsContainer] =
    useState(true);

  // used to determine whether PromptSelection slides in from left/right
  const [startFromLeft, setStartFromLeft] = useState(true);

  const [PBStates, setPBStates] = useState({
    selectCircle: false,
    chooseCircle: false,
    drawCircle: false,
    selectToChooseBar: false,
    chooseToDrawBar: false,
    resetToSelectBar: false,
  });

  const [drawingStatuses, setDrawingStatuses] = useState({
    60: false,
    180: false,
    300: false,
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

  const [lastSeenPrompts, setLastSeenPrompts] = useState(null);

  const [promptsHaveChanged, setPromptsHaveChanged] = useState(false);
  const [statusesHaveChanged, setStatusesHaveChanged] = useState(false);

  const [startNewDailyWordsAnimation, setStartNewDailyWordsAnimation] =
    useState(false);

  const [tempDrawingStatuses, setTempDrawingStatuses] = useState(null);

  const [tempExtraPrompt, setTempExtraPrompt] = useState({
    seconds: 60,
    title: "",
  });

  useEffect(() => {
    console.log(currentColor);
    if (currentColor.toLowerCase() === "#ffffff") {
      document.documentElement.style.setProperty(
        "--dark-animated-gradient-color",
        "rgba(230, 230, 230, .9)"
      );
      document.documentElement.style.setProperty(
        "--light-animated-gradient-color",
        "rgba(230, 230, 230, .5)"
      );
    }
  }, [currentColor]);

  useEffect(() => {
    if (lastSeenPrompts) {
      setDailyPrompts(lastSeenPrompts);
      setLastSeenPrompts(null);
      setPromptsHaveChanged(true);
    }
  }, [lastSeenPrompts]);

  //   read this!
  //   could have just a general counter (start at 0) for dailyPrompts and drawingStatuses
  //   on whenever their onValue functions run increment respective counters
  //   and when prompts === 1 -> setPromptsChanged(true)
  //   and when statuses === 5 (init load = 1, 60180300extra = 5)
  //   when both of these counter conditionals are true -> setStartNewDailyWordsAnimation(true);
  //   then set counters back to 0
  //   (can get rid of all the fluff shit that you added in the interim)
  //

  useEffect(() => {
    // attaching firebase listener so that when prompts update from firebase
    // scheduler function it will update the context states here
    onValue(ref(db, `dailyPrompts`), (snapshot) => {
      if (snapshot.exists()) {
        // setDailyPrompts(snapshot.val());

        if (!lastSeenPrompts) {
          console.log("setting last seen for first time");
          setLastSeenPrompts(snapshot.val());
        }

        // storing current user localStorage data
        let currentUserInfo = JSON.parse(
          localStorage.getItem("unregisteredUserInfo")
        );

        // checking to see if user's drawing statuses need to be updated based
        // on if their last seen prompts match the current prompts
        if (currentUserInfo) {
          if (!isEqual(currentUserInfo["lastSeenPrompts"], snapshot.val())) {
            currentUserInfo["lastSeenPrompts"] = snapshot.val();
            currentUserInfo["dailyCompletedPrompts"] = {
              60: false,
              180: false,
              300: false,
            };
            localStorage.setItem(
              "unregisteredUserInfo",
              JSON.stringify(currentUserInfo)
            );
          }
        }
      }
    });

    // if user isn't logged in
    if (!isLoading && !isAuthenticated) {
      let currentUserInfo = JSON.parse(
        localStorage.getItem("unregisteredUserInfo")
      );

      // this will be set initially when unregistered user visits page,
      // and we manually update drawingStatuses from DrawingScreen component
      // when user finishes a drawing.
      if (currentUserInfo) {
        setTempDrawingStatuses(currentUserInfo.dailyCompletedPrompts);
      }
    }

    // if user is logged in
    if (!isLoading && isAuthenticated) {
      onValue(
        ref(db, `users/${user.sub}/completedDailyPrompts`),
        (snapshot) => {
          if (snapshot.exists()) {
            setTempDrawingStatuses(snapshot.val());
          }
        }
      );

      onValue(ref(db, `users/${user.sub}/extraDailyPrompt`), (snapshot) => {
        if (snapshot.exists()) {
          setTempExtraPrompt(snapshot.val());
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  // could have vars for promptsChanged and statusesChanged

  useEffect(() => {
    if (!isLoading) {
      if (promptsHaveChanged && statusesHaveChanged) {
        // console.log("proceeding because", lastSeenPrompts, dailyPrompts);

        console.log("2 setting anim start from context");
        setStartNewDailyWordsAnimation(true);
        // setPromptsHaveChanged(false);
        // setStatusesHaveChanged(false);
      }
    }
  }, [isLoading, promptsHaveChanged, statusesHaveChanged]);

  useEffect(() => {
    // console.log(lastSeenPrompts, dailyPrompts, tempDrawingStatuses);
    if (tempDrawingStatuses) {
      // console.log("1 officially updated drawingStatuses");
      setDrawingStatuses(tempDrawingStatuses);
      setExtraPrompt(tempExtraPrompt);
      setTempDrawingStatuses(null);
      // setTempExtraPrompt(null); // not sure if this is necessary/good
      setStatusesHaveChanged(true);
    }
  }, [lastSeenPrompts, dailyPrompts, tempDrawingStatuses, tempExtraPrompt]);

  function updatePBStates(field, value) {
    let tempPBStatuses = { ...PBStates };
    tempPBStatuses[field] = value;
    console.log("setting context to", tempPBStatuses);
    setPBStates(tempPBStatuses);
  }

  function resetProgressBar() {
    setPBStates({
      selectCircle: false,
      chooseCircle: false,
      drawCircle: false,
      selectToChooseBar: false,
      chooseToDrawBar: false,
      resetToSelectBar: false,
    });
  }

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

  const context = {
    seconds: seconds,
    setSeconds: setSeconds,
    drawingTime: drawingTime,
    chosenPrompt: chosenPrompt,
    setChosenPrompt: setChosenPrompt,
    setDrawingTime: setDrawingTime,
    buttonAvailability: buttonAvailability,
    setButtonAvailability: setButtonAvailability,
    startFromLeft: startFromLeft,
    setStartFromLeft: setStartFromLeft,
    PBStates: PBStates,
    setPBStates: setPBStates,
    updatePBStates: updatePBStates,
    resetProgressBar: resetProgressBar,
    animateExtraPromptsContainer: animateExtraPromptsContainer,
    setAnimateExtraPromptsContainer: setAnimateExtraPromptsContainer,

    lastSeenPrompts: lastSeenPrompts,
    setLastSeenPrompts: setLastSeenPrompts,
    startNewDailyWordsAnimation: startNewDailyWordsAnimation,
    setStartNewDailyWordsAnimation: setStartNewDailyWordsAnimation,
    tempDrawingStatuses: tempDrawingStatuses,

    promptsHaveChanged: promptsHaveChanged,
    setPromptsHaveChanged: setPromptsHaveChanged,
    statusesHaveChanged: statusesHaveChanged,
    setStatusesHaveChanged: setStatusesHaveChanged,

    drawingStatuses: drawingStatuses,
    setDrawingStatuses: setDrawingStatuses,
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
  };

  return (
    <DrawingSelectionContext.Provider value={context}>
      {props.children}
    </DrawingSelectionContext.Provider>
  );
}

export default DrawingSelectionContext;
