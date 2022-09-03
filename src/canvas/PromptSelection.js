import React, { useContext, useEffect, useRef, useState } from "react";

import anime from "animejs/lib/anime.es.js";
import Select from "react-select";
import Countdown from "react-countdown";
import { useAuth0 } from "@auth0/auth0-react";
import { isEqual } from "lodash";

import formatTime from "../util/formatTime";

import LogInButton from "../oauth/LogInButton";
import DrawingSelectionContext from "./DrawingSelectionContext";

import OneMinuteIcon from "../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../svgs/FiveMinuteIcon";

import { getDatabase, ref as ref_database, onValue } from "firebase/database";

import { app } from "../util/init-firebase";

import classes from "./Canvas.module.css";
import baseClasses from "../index.module.css";

const PromptSelection = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  const DSCtx = useContext(DrawingSelectionContext);

  const db = getDatabase(app);

  const placeHolderText = {
    60: ["Marching", "Orangutan"],
    180: ["Swiftly", "Champagne"],
    300: ["Bearish", "Swindle"],
    extra: ["Goulish", "Werewolf"],
  };

  const promptSelectionRef = useRef(null);
  const normalPromptContainerRef = useRef(null);
  const extraPromptContainerRef = useRef(null);

  const [dynamicRegisterHeight, setDynamicRegisterHeight] = useState(0);

  const [flexDirection, setFlexDirection] = useState("row");
  const [extraPromptsFlexDirection, setExtraPromptsFlexDirection] =
    useState("row");
  const [initInnerWidth, setInitInnerWidth] = useState(1920);

  const [showExtraPrompt, setShowExtraPrompt] = useState(false);
  const [extraPromptHasBeenAnimated, setExtraPromptHasBeenAnimated] =
    useState(false);

  const [formattedSeconds, setFormattedSeconds] = useState("");
  const [adaptiveBackground, setAdaptiveBackground] = useState("");
  const [customAdaptiveBackground, setCustomAdaptiveBackground] = useState(
    classes.yellowBackground
  );
  const [extraDurationIcon, setExtraDurationIcon] = useState();
  const [stylingButtonClasses, setStylingButtonClasses] = useState([
    classes.disabled,
    classes.disabled,
    classes.disabled,
    classes.disabled,
  ]);

  const [hidePlaceholderText, setHidePlaceholderText] = useState(
    DSCtx.startFromLeft
  );

  const [durationOptions, setDurationOptions] = useState();
  const [adjectiveOptions, setAdjectiveOptions] = useState();
  const [nounOptions, setNounOptions] = useState();

  const [selectedDurationOption, setSelectedDurationOption] = useState();
  const [selectedAdjectiveOption, setSelectedAdjectiveOption] = useState();
  const [selectedNounOption, setSelectedNounOption] = useState();

  // don't like doing this below but will keep for now
  const [defaultDurationOption, setDefaultDurationOption] = useState(null);
  const [defaultAdjectiveOption, setDefaultAdjectiveOption] = useState(null);
  const [defaultNounOption, setDefaultNounOption] = useState(null);

  const [nextDisabled, setNextDisabled] = useState(true);
  const [selectedExtraPrompt, setSelectedExtraPrompt] = useState("");
  const [showRegisterContainer, setShowRegisterContainer] = useState(false);
  const [showCountdownTimer, setShowCountdownTimer] = useState(false);
  const [resetAtDate, setResetAtDate] = useState(
    "January 01, 2090 00:00:00 GMT+03:00"
  );

  // once all of these are true then make "Next" button available
  const [customDurationClicked, setCustomDurationClicked] = useState(false);
  const [customAdjectiveClicked, setCustomAdjectiveClicked] = useState(false);
  const [customNounClicked, setCustomNounClicked] = useState(false);

  const [
    showPromptsComingShortlyContainer,
    setShowPromptsComingShortlyContainer,
  ] = useState(false);

  const [adjustedDrawingStatuses, setAdjustedDrawingStatuses] = useState({
    60: true,
    180: true,
    300: true,
  });

  // for custom prompt dropdown
  const styles = {
    menu: ({ width, ...css }) => ({
      ...css,
      width: "max-content",
      minWidth: "75%",
    }),
  };

  useEffect(() => {
    // maybe do resetProcessStarted? idk exactly what difference is
    if (DSCtx.resetComplete === false && !showCountdownTimer) {
      // making sure to get up to date values of context
      setShowPromptsComingShortlyContainer(true);
    }
  }, [DSCtx.resetComplete, showCountdownTimer]);

  useEffect(() => {
    if (!isLoading) {
      if (DSCtx.resetComplete) {
        setTimeout(() => setHidePlaceholderText(false), 800);
        setAdjustedDrawingStatuses(DSCtx.drawingStatuses);
      } else if (DSCtx.resetComplete === false) {
        if (isAuthenticated) {
          setAdjustedDrawingStatuses({
            60: true,
            180: true,
            300: true,
            extra: true,
          });

          setStylingButtonClasses([
            classes.disabled,
            classes.disabled,
            classes.disabled,
            classes.disabled,
          ]);
        } else if (!isAuthenticated) {
          setAdjustedDrawingStatuses({
            60: true,
            180: true,
            300: true,
          });
          setStylingButtonClasses([
            classes.disabled,
            classes.disabled,
            classes.disabled,
          ]);
        }
      }
    }
  }, [isLoading, isAuthenticated, DSCtx.drawingStatuses, DSCtx.resetComplete]);

  useEffect(() => {
    if (customDurationClicked && customAdjectiveClicked && customNounClicked) {
      setNextDisabled(false);
    }
  }, [customDurationClicked, customAdjectiveClicked, customNounClicked]);

  useEffect(() => {
    if (!isLoading) {
      if (
        (showPromptsComingShortlyContainer || showCountdownTimer) &&
        DSCtx.resetComplete === false
      ) {
        setHidePlaceholderText(true);

        // hiding normal/extra prompt text (whichever is showing at the time)
        // note: could probably change this to useEffect that runs whenever
        // showPromptsComingShortlyContainer || showCountdownTimer...
        if (isAuthenticated && showExtraPrompt) {
          anime({
            targets: "#extraPromptText",
            top: [0, "-25px"],
            opacity: [1, 0],
            scale: [1, 0],
            pointerEvents: ["none", "auto"],
            direction: "normal",
            duration: 200,

            loop: false,
            easing: "easeInSine",
          });

          anime({
            targets: "#nextButton",
            loop: false,
            opacity: [1, 0],
            direction: "normal",
            duration: 200,
            easing: "easeInSine",
          });
        } else {
          console.log("hiding reg prompt text");
          anime({
            targets: "#regularPromptText",
            top: [0, "-25px"],
            opacity: [1, 0],
            scale: [1, 0],
            pointerEvents: ["none", "auto"],
            direction: "normal",
            duration: 200,

            loop: false,
            easing: "easeInSine",
          });
        }

        if (
          !isEqual(DSCtx.PBStates, {
            selectCircle: false,
            chooseCircle: false,
            drawCircle: false,
            selectToChooseBar: false,
            chooseToDrawBar: false,
            resetToSelectBar: false,
          })
        ) {
          // change to all being false/default
          console.log("resetting progressbar");
          DSCtx.resetProgressBar();
          DSCtx.setRevertSelectCircle(true);
        }
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    showExtraPrompt,
    DSCtx.PBStates,
    DSCtx.resetComplete,
    showCountdownTimer,
    showPromptsComingShortlyContainer,
  ]);

  useEffect(() => {
    if (DSCtx.startNewDailyWordsAnimation) {
      // animate signup/login container down out of view if it is showing
      if (showPromptsComingShortlyContainer) {
        if (showRegisterContainer) {
          anime({
            targets: "#registerContainer",
            opacity: [1, 0],
            scale: [1, 0],
            direction: "normal",
            duration: 400,
            easing: "easeInSine",
          });

          setShowRegisterContainer(false);
        }

        // animate "a drawing Prompt" into view
        anime({
          targets: "#regularPromptText",
          top: ["-25px", 0],
          opacity: [0, 1],
          scale: [0, 1],
          pointerEvents: ["auto", "none"],
          direction: "normal",
          duration: 500,
          loop: false,
          easing: "easeInSine",
        });

        setShowPromptsComingShortlyContainer(false);
      }

      // fading extra container and showing regular container
      if (showExtraPrompt && extraPromptHasBeenAnimated) {
        // animate "A Drawing Prompt" into view
        anime({
          targets: "#regularPromptText",
          translateY: 0,
          top: 0,
          opacity: [0, 1],
          scale: 1,
          pointerEvents: "auto",
          direction: "normal",
          duration: 1000,
          loop: false,
          easing: "easeInSine",
        });

        // animate extra drawing prompts container out of view
        anime({
          targets: "#extraPromptContainer",
          opacity: [1, 0],
          pointerEvents: "none",
          direction: "normal",
          loop: false,
          duration: 1000,
          easing: "linear",
          complete: () => {
            setShowExtraPrompt(false);
          },
        });

        // animate normal drawing prompts container into view
        anime({
          targets: "#normalPromptContainer",
          translateY: 0,
          scale: 1,
          top: 0,
          opacity: [0, 1],
          pointerEvents: "auto",
          direction: "normal",
          duration: 1000,
          loop: false,

          easing: "linear",
        });
      }

      DSCtx.setStartNewDailyWordsAnimation(false);
    }
  }, [
    DSCtx.startNewDailyWordsAnimation,
    showPromptsComingShortlyContainer,
    extraPromptHasBeenAnimated,
    showRegisterContainer,
    showExtraPrompt,
  ]);

  useEffect(() => {
    if (DSCtx.resetComplete) {
      if (!isLoading && isAuthenticated) {
        // for logged in users

        if (
          DSCtx.drawingStatuses["60"] &&
          DSCtx.drawingStatuses["180"] &&
          DSCtx.drawingStatuses["300"] &&
          DSCtx.drawingStatuses["extra"]
        ) {
          setShowCountdownTimer(true);
        }

        if (
          DSCtx.drawingStatuses["60"] &&
          DSCtx.drawingStatuses["180"] &&
          DSCtx.drawingStatuses["300"] &&
          !DSCtx.drawingStatuses["extra"]
        ) {
          setShowExtraPrompt(true);
        }

        if (DSCtx.drawingStatuses?.["extra"] !== undefined) {
          setStylingButtonClasses([
            adjustedDrawingStatuses["60"] ? classes.disabled : classes.pointer,
            adjustedDrawingStatuses["180"] ? classes.disabled : classes.pointer,
            adjustedDrawingStatuses["300"] ? classes.disabled : classes.pointer,
            adjustedDrawingStatuses["extra"]
              ? classes.disabled
              : classes.pointer,
          ]);
        }

        setDurationOptions([
          {
            value: 60,
            label: "One Minute",
            disabled: false,
          },
          {
            value: 180,
            label: "Three Minutes",
            disabled: false,
          },
          {
            value: 300,
            label: "Five Minutes",
            disabled: false,
          },
        ]);

        setAdjectiveOptions([
          {
            value: 60,
            label: DSCtx.dailyPrompts["60"].split(" ")[0],
            disabled: false,
          },
          {
            value: 180,
            label: DSCtx.dailyPrompts["180"].split(" ")[0],
            disabled: false,
          },
          {
            value: 300,
            label: DSCtx.dailyPrompts["300"].split(" ")[0],
            disabled: false,
          },
        ]);

        setNounOptions([
          {
            value: 60,
            label: DSCtx.dailyPrompts["60"].split(" ")[1],
            disabled: false,
          },
          {
            value: 180,
            label: DSCtx.dailyPrompts["180"].split(" ")[1],
            disabled: false,
          },
          {
            value: 300,
            label: DSCtx.dailyPrompts["300"].split(" ")[1],
            disabled: false,
          },
        ]);

        setDefaultDurationOption({
          value: 60,
          label: "One Minute",
        });

        setDefaultAdjectiveOption({
          value: 180,
          label: DSCtx.dailyPrompts["180"].split(" ")[0],
        });

        setDefaultNounOption({
          value: 300,
          label: DSCtx.dailyPrompts["300"].split(" ")[1],
        });

        setSelectedDurationOption({
          value: 60,
          label: "One Minute",
        });

        setSelectedAdjectiveOption({
          value: 180,
          label: DSCtx.dailyPrompts["180"].split(" ")[0],
        });

        setSelectedNounOption({
          value: 300,
          label: DSCtx.dailyPrompts["300"].split(" ")[1],
        });
      }
      // for unregistered users
      else if (!isLoading && !isAuthenticated) {
        if (
          DSCtx.drawingStatuses["60"] &&
          DSCtx.drawingStatuses["180"] &&
          DSCtx.drawingStatuses["300"]
        ) {
          setShowCountdownTimer(true);
        }

        setStylingButtonClasses([
          adjustedDrawingStatuses["60"] ? classes.disabled : classes.pointer,
          adjustedDrawingStatuses["180"] ? classes.disabled : classes.pointer,
          adjustedDrawingStatuses["300"] ? classes.disabled : classes.pointer,
        ]);
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    DSCtx.resetComplete,
    DSCtx.dailyPrompts,
    DSCtx.drawingStatuses,
    adjustedDrawingStatuses,
  ]);

  useEffect(() => {
    if (
      selectedDurationOption &&
      selectedAdjectiveOption &&
      selectedNounOption
    ) {
      updateDisabledOptions(
        selectedDurationOption.value,
        selectedAdjectiveOption.value,
        selectedNounOption.value
      );
    }
    if (selectedDurationOption) {
      if (selectedDurationOption.value === 60)
        setCustomAdaptiveBackground(classes.redBackground);
      else if (selectedDurationOption.value === 180)
        setCustomAdaptiveBackground(classes.yellowBackground);
      else if (selectedDurationOption.value === 300)
        setCustomAdaptiveBackground(classes.greenBackground);
    }
  }, [selectedDurationOption, selectedAdjectiveOption, selectedNounOption]);

  useEffect(() => {
    if (
      showExtraPrompt &&
      !extraPromptHasBeenAnimated &&
      DSCtx.extraPrompt.title !== "" &&
      !DSCtx.drawingStatuses["extra"]
    ) {
      if (DSCtx.extraPrompt.seconds === 60) {
        setFormattedSeconds("1 Minute");
        setAdaptiveBackground(classes.redBackground);
        setExtraDurationIcon(<OneMinuteIcon dimensions={"3em"} />);
      } else if (DSCtx.extraPrompt.seconds === 180) {
        setFormattedSeconds("3 Minutes");
        setAdaptiveBackground(classes.yellowBackground);
        setExtraDurationIcon(<ThreeMinuteIcon dimensions={"3em"} />);
      } else {
        setFormattedSeconds("5 Minutes");
        setAdaptiveBackground(classes.greenBackground);
        setExtraDurationIcon(<FiveMinuteIcon dimensions={"3em"} />);
      }

      if (DSCtx.startFromLeft) {
        // animate "A Drawing Prompt" down out of view
        anime({
          targets: "#regularPromptText",
          top: [0, "25px"],
          opacity: [1, 0],
          scale: [1, 0],
          pointerEvents: ["auto", "none"],
          direction: "normal",
          duration: 1000,
          delay: 350,

          loop: false,
          easing: "easeInSine",
        });
        // animate "An Extra Drawing Prompt" down into view
        anime({
          targets: "#extraPromptText",
          top: ["-25px", 0],
          opacity: [0, 1],
          scale: [0, 1],
          pointerEvents: ["auto", "none"],
          direction: "normal",
          delay: 500,
          loop: false,
          duration: 1000,
          easing: "easeInSine",
        });

        // animate normal drawing prompts container down out of view
        anime({
          targets: "#normalPromptContainer",
          translateY: [0, "225px"],
          scale: [1, 0],
          opacity: [1, 0],
          delay: 350,

          pointerEvents: ["auto", "none"],
          direction: "normal",
          duration: 1000,
          loop: false,

          easing: "linear",
        });

        // animate extra drawing prompts container down into view
        anime({
          targets: "#extraPromptContainer",
          translateY: ["-225px", 0],
          opacity: [0, 1],
          scale: [0, 1],
          delay: 500,

          pointerEvents: "auto",
          direction: "normal",
          loop: false,

          duration: 1000,
          easing: "linear",
        });

        anime({
          targets: "#nextButton",
          loop: false,
          delay: 800,
          opacity: [0, 1],
          direction: "normal",
          duration: 1500,
          easing: "easeInSine",
          complete: () => {
            setExtraPromptHasBeenAnimated(true);
          },
        });
      }

      DSCtx.setExtraPromptsShown(true);
    } else {
      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"] &&
        Object.keys(DSCtx.drawingStatuses).length === 3
      ) {
        // blurring out the regular prompts
        if (window.innerWidth > 1200) {
          setShowRegisterContainer(true);
        }

        // animate signup/login container down into view
        anime({
          targets: "#registerContainer",
          opacity: [0, 1],
          scale: [0, 1],
          // maybe scale this [0, 1] ?
          direction: "normal",
          duration: 500,
          easing: "easeInSine",
        });
      }
    }
  }, [showExtraPrompt, DSCtx.extraPrompt, DSCtx.drawingStatuses]);

  useEffect(() => {
    onValue(ref_database(db, "masterDateToResetPromptsAt"), (snapshot) => {
      if (snapshot.exists()) {
        setResetAtDate(snapshot.val());
      }
    });

    document.getElementById("root").scrollIntoView({ behavior: "smooth" });

    anime({
      targets: "#promptSelection",
      loop: false,
      translateX: DSCtx.startFromLeft
        ? window.innerWidth
        : -1 * window.innerWidth,
      opacity: [0, 1],
      direction: "normal",
      duration: 500,
      easing: "easeInSine",
    });
  }, [DSCtx.startFromLeft]);

  useEffect(() => {
    // only set selectCircle to true if PBStates is default state
    // + not all daily's finished
    if (
      isEqual(DSCtx.PBStates, {
        selectCircle: false,
        chooseCircle: false,
        drawCircle: false,
        selectToChooseBar: false,
        chooseToDrawBar: false,
        resetToSelectBar: false,
      }) &&
      DSCtx.resetComplete
    ) {
      // regular flow (drawings init loaded + not all prompts have been completed)
      // -> start animation of selectCircle
      if (!isLoading && isAuthenticated) {
        if (
          !DSCtx.drawingStatuses["60"] ||
          !DSCtx.drawingStatuses["180"] ||
          !DSCtx.drawingStatuses["300"] ||
          !DSCtx.drawingStatuses["extra"]
        ) {
          DSCtx.updatePBStates("selectCircle", true);
        }
      } else if (!isLoading && !isAuthenticated) {
        if (
          !DSCtx.drawingStatuses["60"] ||
          !DSCtx.drawingStatuses["180"] ||
          !DSCtx.drawingStatuses["300"]
        ) {
          DSCtx.updatePBStates("selectCircle", true);
        }
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    DSCtx.resetComplete,
    DSCtx.PBStates,
    DSCtx.drawingStatuses,
    DSCtx.dailyPrompts,
  ]);

  useEffect(() => {
    // just for initial render
    if (window.innerWidth <= 1200) {
      setFlexDirection("column");
      setShowRegisterContainer(false);

      if (window.innerWidth <= 800) {
        setExtraPromptsFlexDirection("column");
      } else {
        setExtraPromptsFlexDirection("row");
      }
    } else {
      setFlexDirection("row");
      setExtraPromptsFlexDirection("row");

      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"] &&
        Object.keys(DSCtx.drawingStatuses).length === 3
      ) {
        // blurring out the regular prompts
        if (window.innerWidth > 1200) {
          setShowRegisterContainer(true);
        }
      }
    }

    if (
      document.getElementById("normalPromptContainer") !== null &&
      document.getElementById("registerPromoContainer") !== null
    ) {
      setDynamicRegisterHeight(
        `${
          document
            .getElementById("normalPromptContainer")
            .getBoundingClientRect().height /
            2 -
          document
            .getElementById("registerPromoContainer")
            .getBoundingClientRect().height /
            2.2
        }px`
      );
    } else {
      setDynamicRegisterHeight(0);
    }

    function resizeHandler() {
      if (window.innerWidth <= 1200) {
        setFlexDirection("column");
        setShowRegisterContainer(false);

        if (window.innerWidth <= 800) {
          setExtraPromptsFlexDirection("column");
        } else {
          setExtraPromptsFlexDirection("row");
        }
      } else {
        setFlexDirection("row");
        setExtraPromptsFlexDirection("row");

        if (
          DSCtx.drawingStatuses["60"] &&
          DSCtx.drawingStatuses["180"] &&
          DSCtx.drawingStatuses["300"] &&
          Object.keys(DSCtx.drawingStatuses).length === 3
        ) {
          // blurring out the regular prompts
          if (window.innerWidth > 1200) {
            setShowRegisterContainer(true);
          }
        }
      }

      if (
        document.getElementById("normalPromptContainer") !== null &&
        document.getElementById("registerPromoContainer") !== null
      ) {
        setDynamicRegisterHeight(
          `${
            document
              .getElementById("normalPromptContainer")
              .getBoundingClientRect().height /
              2 -
            document
              .getElementById("registerPromoContainer")
              .getBoundingClientRect().height /
              2.2
          }px`
        );
      } else {
        setDynamicRegisterHeight(0);
      }
    }

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [DSCtx.showPromptSelection, DSCtx.drawingStatuses]);

  useEffect(() => {
    setInitInnerWidth(window.innerWidth);
  }, []);

  function updateDisabledOptions(duration, adj, noun) {
    setDurationOptions([
      {
        value: 60,
        label: "One Minute",
        disabled: adj === 60 && noun === 60,
      },
      {
        value: 180,
        label: "Three Minutes",
        disabled: adj === 180 && noun === 180,
      },
      {
        value: 300,
        label: "Five Minutes",
        disabled: adj === 300 && noun === 300,
      },
    ]);

    setAdjectiveOptions([
      {
        value: 60,
        label: DSCtx.dailyPrompts["60"].split(" ")[0],
        disabled: duration === 60 && noun === 60,
      },
      {
        value: 180,
        label: DSCtx.dailyPrompts["180"].split(" ")[0],
        disabled: duration === 180 && noun === 180,
      },
      {
        value: 300,
        label: DSCtx.dailyPrompts["300"].split(" ")[0],
        disabled: duration === 300 && noun === 300,
      },
    ]);

    setNounOptions([
      {
        value: 60,
        label: DSCtx.dailyPrompts["60"].split(" ")[1],
        disabled: duration === 60 && adj === 60,
      },
      {
        value: 180,
        label: DSCtx.dailyPrompts["180"].split(" ")[1],
        disabled: duration === 180 && adj === 180,
      },
      {
        value: 300,
        label: DSCtx.dailyPrompts["300"].split(" ")[1],
        disabled: duration === 300 && adj === 300,
      },
    ]);
  }

  function updateStatesAndShowNextComponent(seconds, prompt, isExtra = false) {
    if (
      (isExtra && DSCtx.drawingStatuses["extra"]) ||
      (!isExtra && DSCtx.drawingStatuses[seconds])
    ) {
      return;
    }

    document.getElementById("root").scrollIntoView({ behavior: "smooth" });

    const intervalID = setInterval(() => {
      if (window.scrollY === 0) {
        DSCtx.updatePBStates("selectToChooseBar", true);
        clearInterval(intervalID);
      }
    }, 500);

    anime({
      targets: "#promptSelection",
      loop: false,
      translateX: DSCtx.startFromLeft ? window.innerWidth * 2 : 0,
      opacity: [1, 0],
      direction: "normal",
      duration: 500,
      easing: "easeInSine",
      complete: function () {
        DSCtx.setDrawingTime(seconds);
        DSCtx.setChosenPrompt(prompt);
        DSCtx.setShowPaletteChooser(true);
        DSCtx.setShowDrawingScreen(false);
        DSCtx.setShowEndOverlay(false);
        DSCtx.setShowEndOutline(false);
        DSCtx.setShowPromptSelection(false);
      },
    });
  }

  return (
    <div
      id={"promptSelection"}
      ref={promptSelectionRef}
      style={{
        position: "relative",
        left: `${DSCtx.startFromLeft ? -1 * initInnerWidth : initInnerWidth}px`,
        // top: "5vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          position: "relative",
          top: "175px",
        }}
        className={classes.timerSelectionsModal}
      >
        <div
          style={{
            marginBottom: "2em",
            position: "relative",
            width: "300px",
            height: "25px",
          }}
        >
          <div
            id={"regularPromptText"}
            style={{
              position: "absolute",
              width: "300px",
              height: "25px",
              top: 0,
              textAlign: "center",
              opacity:
                !showCountdownTimer &&
                !showPromptsComingShortlyContainer &&
                !showExtraPrompt
                  ? 1
                  : 0,
            }}
          >
            A Drawing Prompt
          </div>
          <div
            id={"extraPromptText"}
            style={{
              position: "absolute",
              width: "300px",
              height: "25px",
              top: 0,
              textAlign: "center",
              opacity:
                !showCountdownTimer &&
                !showPromptsComingShortlyContainer &&
                showExtraPrompt
                  ? 1
                  : 0,
            }}
          >
            An Extra Prompt
          </div>
        </div>

        <div
          id={"parentPromptContain"}
          style={{
            position: "relative",
            width:
              showRegisterContainer && window.innerWidth < 1200
                ? "clamp(200px, 100%, 675px)"
                : "675px",
            height: "300px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              width:
                showRegisterContainer && window.innerWidth < 1200
                  ? "clamp(200px, 100%, 675px)"
                  : "675px",
              height: "300px",
              opacity: !DSCtx.startFromLeft && showExtraPrompt ? 0 : 1,
            }}
          >
            <div
              style={{
                filter: showRegisterContainer ? "blur(4px)" : "",
                pointerEvents: showRegisterContainer ? "none" : "auto",
                flexDirection: flexDirection,
              }}
              ref={normalPromptContainerRef}
              id={"normalPromptContainer"}
              className={classes.horizContain}
            >
              <div
                className={`${classes.durationButton} ${classes.redBackground} ${stylingButtonClasses[0]}`}
                onClick={() => {
                  updateStatesAndShowNextComponent(
                    60,
                    DSCtx.dailyPrompts["60"]
                  );
                }}
              >
                <OneMinuteIcon dimensions={"3em"} />

                <div className={classes.timeBorder}>1 Minute</div>

                <div
                  style={{
                    filter: hidePlaceholderText ? "blur(5px)" : "",
                    transition: "all 100ms",
                  }}
                  className={`${classes.promptTextMargin} ${baseClasses.baseVertFlex}`}
                >
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText[60][0]
                      : DSCtx.dailyPrompts["60"].split(" ")[0]}
                  </div>
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText[60][1]
                      : DSCtx.dailyPrompts["60"].split(" ")[1]}
                  </div>
                </div>
              </div>
              <div
                className={`${classes.durationButton} ${classes.yellowBackground} ${stylingButtonClasses[1]}`}
                onClick={() => {
                  updateStatesAndShowNextComponent(
                    180,
                    DSCtx.dailyPrompts["180"]
                  );
                }}
              >
                <ThreeMinuteIcon dimensions={"3em"} />

                <div className={classes.timeBorder}>3 Minutes</div>

                <div
                  style={{
                    filter: hidePlaceholderText ? "blur(5px)" : "",
                    transition: "all 100ms",
                  }}
                  className={`${classes.promptTextMargin} ${baseClasses.baseVertFlex}`}
                >
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText[180][0]
                      : DSCtx.dailyPrompts["180"].split(" ")[0]}
                  </div>
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText[180][1]
                      : DSCtx.dailyPrompts["180"].split(" ")[1]}
                  </div>
                </div>
              </div>
              <div
                className={`${classes.durationButton} ${classes.greenBackground} ${stylingButtonClasses[2]}`}
                onClick={() => {
                  updateStatesAndShowNextComponent(
                    300,
                    DSCtx.dailyPrompts["300"]
                  );
                }}
              >
                <FiveMinuteIcon dimensions={"3em"} />

                <div className={classes.timeBorder}>5 Minutes</div>

                <div
                  style={{
                    filter: hidePlaceholderText ? "blur(5px)" : "",
                    transition: "all 100ms",
                  }}
                  className={`${classes.promptTextMargin} ${baseClasses.baseVertFlex}`}
                >
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText[300][0]
                      : DSCtx.dailyPrompts["300"].split(" ")[0]}
                  </div>
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText[300][1]
                      : DSCtx.dailyPrompts["300"].split(" ")[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={showExtraPrompt ? "" : classes.hide}
            style={{
              position: "absolute",
              top: 0,
              width: "675px",
              height: "300px",
              opacity: 1,
              pointerEvents: showExtraPrompt ? "auto" : "none",
            }}
          >
            <div
              style={{
                flexDirection: extraPromptsFlexDirection,
              }}
              ref={extraPromptContainerRef}
              id={"extraPromptContainer"}
              className={classes.horizContain}
            >
              {/* daily extra prompt */}
              <div
                className={`${classes.durationButton} ${adaptiveBackground} ${stylingButtonClasses[3]}`}
                style={{
                  height: "100%",
                  cursor: "pointer",
                  backgroundPosition:
                    selectedExtraPrompt === "normal" ? "200px" : "",
                }}
                onClick={() => {
                  setSelectedExtraPrompt("normal");
                  setNextDisabled(false);
                }}
              >
                {extraDurationIcon}

                <div className={classes.timeBorder}>{formattedSeconds}</div>

                <div
                  style={{
                    filter:
                      hidePlaceholderText && showExtraPrompt ? "blur(5px)" : "",
                    transition: "all 50ms",
                  }}
                  className={`${classes.promptTextMargin} ${baseClasses.baseVertFlex}`}
                >
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText["extra"][0]
                      : DSCtx.extraPrompt.title.split(" ")[0]}
                  </div>
                  <div>
                    {hidePlaceholderText
                      ? placeHolderText["extra"][1]
                      : DSCtx.extraPrompt.title.split(" ")[1]}
                  </div>
                </div>
              </div>

              {/* custom prompt */}
              <div
                className={`${classes.durationButton} ${customAdaptiveBackground} ${stylingButtonClasses[3]}`}
                style={{
                  height: "282px",
                  padding: "1.5em",
                  cursor: "pointer",
                  gap: "1.25em",
                  backgroundPosition:
                    selectedExtraPrompt === "custom" ? "200px" : "",
                }}
                onClick={() => {
                  setSelectedExtraPrompt("custom");

                  // if even one input hasn't been selected, disable "Next" button
                  if (
                    !customDurationClicked ||
                    !customAdjectiveClicked ||
                    !customNounClicked
                  ) {
                    setNextDisabled(true);
                  }
                }}
              >
                {/* <div style={{textAlign: selectedDurationOption ? }}> */}
                <Select
                  defaultValue={defaultDurationOption}
                  options={durationOptions}
                  styles={styles}
                  isSearchable={false}
                  placeholder="Duration"
                  isOptionDisabled={(option) => option.disabled}
                  onChange={(e) => {
                    setSelectedDurationOption(e);
                    setCustomDurationClicked(true);
                  }}
                  formatOptionLabel={(option) => (
                    <>
                      {option.value === 60 && (
                        <div
                          style={{
                            opacity: option.disabled ? 0.5 : 1,
                            padding: ".25em 0",
                          }}
                          className={baseClasses.baseFlex}
                        >
                          <OneMinuteIcon dimensions={"1.5em"} />
                        </div>
                      )}
                      {option.value === 180 && (
                        <div
                          style={{
                            opacity: option.disabled ? 0.5 : 1,
                            padding: ".25em 0",
                          }}
                          className={baseClasses.baseFlex}
                        >
                          <ThreeMinuteIcon dimensions={"1.5em"} />
                        </div>
                      )}

                      {option.value === 300 && (
                        <div
                          style={{
                            opacity: option.disabled ? 0.5 : 1,
                            padding: ".25em 0",
                          }}
                          className={baseClasses.baseFlex}
                        >
                          <FiveMinuteIcon dimensions={"1.5em"} />
                        </div>
                      )}
                    </>
                  )}
                />

                <Select
                  defaultValue={defaultAdjectiveOption}
                  options={adjectiveOptions}
                  styles={styles}
                  isSearchable={false}
                  placeholder="Adjective"
                  isOptionDisabled={(option) => option.disabled}
                  onChange={(e) => {
                    setSelectedAdjectiveOption(e);
                    setCustomAdjectiveClicked(true);
                  }}
                />

                <Select
                  defaultValue={defaultNounOption}
                  options={nounOptions}
                  styles={styles}
                  isSearchable={false}
                  placeholder="Noun"
                  isOptionDisabled={(option) => option.disabled}
                  onChange={(e) => {
                    setSelectedNounOption(e);
                    setCustomNounClicked(true);
                  }}
                />
              </div>
            </div>
          </div>

          <div
            id={"nextButton"}
            style={{
              position: "absolute",
              top: extraPromptsFlexDirection === "row" ? "355px" : "660px",
              left: "43.5%",
              width: "75px",
              height: "40px",
              opacity: showExtraPrompt ? 1 : 0,
            }}
          >
            <button
              style={{ fontSize: "16px" }}
              className={baseClasses.activeButton}
              disabled={nextDisabled}
              onClick={() => {
                const seconds =
                  selectedExtraPrompt === "normal"
                    ? DSCtx.extraPrompt.seconds
                    : selectedDurationOption.value;
                const title =
                  selectedExtraPrompt === "normal"
                    ? DSCtx.extraPrompt.title
                    : `${selectedAdjectiveOption.label}  ${selectedNounOption.label}`;
                updateStatesAndShowNextComponent(seconds, title, true);
              }}
            >
              Next
            </button>
          </div>

          <div
            id={"registerContainer"}
            style={{
              position: "absolute",
              top: window.innerWidth < 1200 ? "-190px" : dynamicRegisterHeight,
              left: 0,
              right: 0,
              width: "100%",
              height: window.innerWidth < 1200 ? "7em" : "225px",
              opacity: 0,
              pointerEvents: showRegisterContainer ? "auto" : "none",
            }}
            className={`${classes.registerContainer} ${baseClasses.baseFlex}`}
          >
            <div
              id={"registerPromoContainer"}
              style={{
                height: window.innerWidth < 1200 ? "7em" : "10em",
              }}
              className={classes.registerPromoContainer}
            >
              <div className={classes.baseFlex}>
                {showRegisterContainer && (
                  <LogInButton forceShowSignUp={true} />
                )}
                <div>or</div>
                {showRegisterContainer && (
                  <LogInButton forceShowSignUp={false} />
                )}
              </div>

              <div style={{ width: "60%", textAlign: "center" }}>
                to choose your daily extra prompt and gain full access to all
                features!
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "-85px",
            width:
              showCountdownTimer || showPromptsComingShortlyContainer
                ? "420px"
                : 0,
            height:
              showCountdownTimer || showPromptsComingShortlyContainer
                ? "117px"
                : 0,
            opacity:
              showCountdownTimer || showPromptsComingShortlyContainer ? 1 : 0,
            transition: "all 500ms",
          }}
          className={baseClasses.baseFlex}
        >
          <div
            id={"countdownContainer"}
            style={{
              position: "absolute",
              width: window.innerWidth < 500 ? "75%" : "100%",
              height: "100%",
              opacity: showCountdownTimer ? 1 : 0,
              userSelect: showCountdownTimer ? "auto" : "none",
              transition: "all 500ms",
            }}
            className={`${classes.promptRefreshTimer} ${baseClasses.baseVertFlex}`}
          >
            <div className={baseClasses.baseFlex}>New prompts refresh in</div>

            {showCountdownTimer && (
              <Countdown
                date={resetAtDate}
                renderer={formatTime}
                onComplete={() => {
                  setShowCountdownTimer(false);
                }}
              />
            )}
          </div>

          <div
            id={"promptsRefreshingShortlyContainer"}
            style={{
              position: "absolute",
              width: window.innerWidth < 500 ? "75%" : "100%",
              height: "100%",
              gap: "1em",
              opacity: showPromptsComingShortlyContainer ? 1 : 0,
              userSelect: showPromptsComingShortlyContainer ? "auto" : "none",
              transition: "all 500ms",
            }}
            className={`${classes.promptRefreshTimer} ${baseClasses.baseFlex}`}
          >
            <div
              style={{
                fontSize: window.innerWidth < 500 ? ".85em" : "1em",
              }}
            >
              New prompts coming shortly
            </div>

            {/* animated loading circle svg */}
            <div className={classes.mainLoader}>
              <div className={classes.loader}>
                <svg className={classes.circularLoader} viewBox="25 25 50 50">
                  <circle
                    className={classes.loaderPath}
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    stroke="#EEEEEE"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSelection;
