import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import anime from "animejs/lib/anime.es.js";
import Select from "react-select";
import Countdown from "react-countdown";
import { useAuth0 } from "@auth0/auth0-react";

import LogInButton from "../oauth/LogInButton";
import DrawingSelectionContext from "./DrawingSelectionContext";

import OneMinuteIcon from "../svgs/OneMinuteIcon";
import ThreeMinuteIcon from "../svgs/ThreeMinuteIcon";
import FiveMinuteIcon from "../svgs/FiveMinuteIcon";

import {
  getDatabase,
  ref as ref_database,
  set,
  onValue,
  child,
  get,
} from "firebase/database";

import { app } from "../util/init-firebase";

import classes from "./Canvas.module.css";
import baseClasses from "../index.module.css";

const PromptSelection = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  const DSCtx = useContext(DrawingSelectionContext);

  const db = getDatabase(app);
  const dbRef = ref_database(getDatabase(app));

  // classes.hide
  const [showExtraPrompt, setShowExtraPrompt] = useState(false);
  const [formattedSeconds, setFormattedSeconds] = useState("");
  const [adaptiveBackground, setAdaptiveBackground] = useState("");
  const [customAdaptiveBackground, setCustomAdaptiveBackground] = useState(
    classes.yellowBackground
  ); // temporary
  const [extraDurationIcon, setExtraDurationIcon] = useState();
  const [stylingButtonClasses, setStylingButtonClasses] = useState([
    classes.pointer,
    classes.pointer,
    classes.pointer,
  ]);

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
  const [blurState, setBlurState] = useState("");
  const [showCountdownTimer, setShowCountdownTimer] = useState(false);
  const [resetAtDate, setResetAtDate] = useState(
    "January 01, 2030 00:00:00 GMT+03:00"
  );

  // for custom prompt dropdown
  const styles = {
    menu: ({ width, ...css }) => ({
      ...css,
      width: "max-content",
      minWidth: "75%",
    }),
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // for logged in users

      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"] &&
        DSCtx.drawingStatuses["extra"]
      ) {
        setShowCountdownTimer(true);
        // ideally have all progressbar logic inside that component, have it look for these exact
        // conditions (drop the extra if user isn't logged in)
      }

      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"] &&
        !DSCtx.drawingStatuses["extra"]
      ) {
        setShowExtraPrompt(true);
      }

      setStylingButtonClasses([
        DSCtx.drawingStatuses["60"] ? classes.disabled : classes.pointer,
        DSCtx.drawingStatuses["180"] ? classes.disabled : classes.pointer,
        DSCtx.drawingStatuses["300"] ? classes.disabled : classes.pointer,
      ]);

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
    } else if (!isLoading && !isAuthenticated) {
      // for unregistered users

      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"]
      ) {
        setShowCountdownTimer(true);
        // ideally have all progressbar logic inside that component, have it look for these exact
        // conditions (drop the extra if user isn't logged in)
      }

      setStylingButtonClasses([
        DSCtx.drawingStatuses["60"] ? classes.disabled : classes.pointer,
        DSCtx.drawingStatuses["180"] ? classes.disabled : classes.pointer,
        DSCtx.drawingStatuses["300"] ? classes.disabled : classes.pointer,
      ]);
    }
  }, [isLoading, isAuthenticated, DSCtx.drawingStatuses]);

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
      console.log(selectedDurationOption);
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
      DSCtx.extraPrompt.title !== "" &&
      !DSCtx.drawingStatuses["extra"]
    ) {
      console.log(showExtraPrompt, DSCtx.drawingStatuses);
      if (DSCtx.extraPrompt.seconds === 60) {
        setFormattedSeconds("1 Minute");
        setAdaptiveBackground(classes.redBackground);
        setExtraDurationIcon(<OneMinuteIcon dimensions={"3.5em"} />);
      } else if (DSCtx.extraPrompt.seconds === 180) {
        setFormattedSeconds("3 Minutes");
        setAdaptiveBackground(classes.yellowBackground);
        setExtraDurationIcon(<ThreeMinuteIcon dimensions={"3.5em"} />);
      } else {
        setFormattedSeconds("5 Minutes");
        setAdaptiveBackground(classes.greenBackground);
        setExtraDurationIcon(<FiveMinuteIcon dimensions={"3.5em"} />);
      }

      // animate "A Drawing Prompt" down out of view
      anime({
        targets: "#regularPromptText",
        translateY: [0, "25px"],
        opacity: [1, 0],
        scale: [1, 0],
        pointerEvents: ["auto", "none"],
        direction: "normal",
        duration: 1000,
        delay: 350,

        loop: false,
        easing: "linear",
      });
      // animate "An Extra Drawing Prompt" down into view
      anime({
        targets: "#extraPromptText",
        translateY: [0, "25px"],
        opacity: [0, 1],
        scale: [0, 1],
        pointerEvents: ["auto", "none"],
        direction: "normal",
        delay: 500,
        loop: false,
        duration: 1000,
        easing: "linear",
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
        translateY: [0, "225px"],
        // delay: 200,
        opacity: [0, 1],
        scale: [0, 1],
        delay: 500,

        pointerEvents: ["none", "auto"],
        direction: "normal",
        loop: false,

        duration: 1000,
        easing: "linear",
      });

      anime({
        targets: "#nextButton",
        // translateY: "1276px",
        // height: [0, "100%"],

        loop: false,
        delay: 800,
        opacity: [0, 1],
        direction: "normal",
        duration: 1500,
        easing: "linear",
      });
    } else {
      if (
        DSCtx.drawingStatuses["60"] &&
        DSCtx.drawingStatuses["180"] &&
        DSCtx.drawingStatuses["300"] &&
        DSCtx.drawingStatuses.length === 3
      ) {
        // blurring out the regular prompts
        setBlurState("blur");

        // animate signup/login container down into view
        anime({
          targets: "#registerContainer",
          opacity: [0, 1],
          // maybe scale this [0, 1] ?
          pointerEvents: ["none", "auto"],
          direction: "normal",
          duration: 1500,
          easing: "linear",
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
    console.log("inner width", window.innerWidth);
    anime({
      targets: "#promptSelection",
      loop: false,
      translateX: DSCtx.startFromLeft
        ? window.innerWidth
        : -1 * window.innerWidth,
      opacity: [0, 1],
      direction: "normal",
      duration: 250,
      easing: "easeInSine",
    });

    DSCtx.updatePBStates("selectCircle", true);
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

    DSCtx.updatePBStates("selectToChooseBar", true);

    anime({
      targets: "#promptSelection",
      loop: false,
      translateX: window.innerWidth * 2,
      opacity: [1, 0],
      direction: "normal",
      duration: 450,
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

  // formatting function to display HH:MM:SS for countdown
  const formatTime = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <div>New prompts are arriving soon!</div>;
    } else {
      // Render a countdown
      let formattedHours = hours < 10 ? `0${hours}` : hours;
      let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      return (
        <span>
          {formattedHours}:{formattedMinutes}:{formattedSeconds}
        </span>
      );
    }
  };

  return (
    <div
      id={"promptSelection"}
      style={{
        position: "relative",
        left: `${
          DSCtx.startFromLeft ? -1 * window.innerWidth : window.innerWidth
        }px`,
        top: "5vh",
        width: "100vw",
      }}
    >
      <div className={classes.timerSelectionsModal}>
        <div
          style={{
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
              opacity: !showCountdownTimer ? 1 : 0,
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
              top: "-25px",
              textAlign: "center",
              opacity: !showCountdownTimer && showExtraPrompt ? 1 : 0,
            }}
          >
            An Extra Prompt
          </div>
        </div>

        <div
          style={{
            position: "relative",
            width: "675px",
            height: "276px",
          }}
        >
          <div
            id={"normalPromptContainer"}
            style={{
              position: "absolute",
              top: 0,
              width: "675px",
              height: "276px",
            }}
          >
            <div id={blurState} className={classes.horizContain}>
              <div
                className={`${classes.durationButton} ${classes.redBackground} ${stylingButtonClasses[0]}`}
                onClick={() => {
                  updateStatesAndShowNextComponent(
                    60,
                    DSCtx.dailyPrompts["60"]
                  );
                }}
              >
                <OneMinuteIcon dimensions={"3.5em"} />

                <div className={classes.timeBorder}>1 Minute</div>

                <div className={classes.promptTextMargin}>
                  {DSCtx.dailyPrompts["60"]}
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
                <ThreeMinuteIcon dimensions={"3.5em"} />

                <div className={classes.timeBorder}>3 Minutes</div>

                <div className={classes.promptTextMargin}>
                  {DSCtx.dailyPrompts["180"]}
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
                <FiveMinuteIcon dimensions={"3.5em"} />

                <div className={classes.timeBorder}>5 Minutes</div>

                <div className={classes.promptTextMargin}>
                  {DSCtx.dailyPrompts["300"]}
                </div>
              </div>
            </div>
          </div>

          <div
            id={"extraPromptContainer"}
            className={showExtraPrompt ? "" : classes.hide}
            style={{
              position: "absolute",
              top: "-225px",
              width: "675px",
              height: "276px",
              opacity: 0,
              pointerEvents: showExtraPrompt ? "auto" : "none",
            }}
          >
            <div className={classes.horizContain}>
              {/* daily extra prompt */}
              <div
                className={`${classes.durationButton} ${adaptiveBackground}`}
                style={{
                  height: "100%",
                  cursor: "pointer",
                  backgroundPosition:
                    selectedExtraPrompt === "regular" ? "200px" : "",
                }}
                onClick={() => {
                  setSelectedExtraPrompt("regular");
                  setNextDisabled(false);
                }}
              >
                {extraDurationIcon}

                <div className={classes.timeBorder}>{formattedSeconds}</div>

                <div className={classes.promptTextMargin}>
                  {DSCtx.extraPrompt.title}
                </div>
              </div>

              {/* custom prompt */}
              <div
                className={`${classes.durationButton} ${customAdaptiveBackground}`}
                style={{
                  height: "276px",
                  padding: "1.5em",
                  cursor: "pointer",
                  backgroundPosition:
                    selectedExtraPrompt === "custom" ? "200px" : "",
                }}
                onClick={() => {
                  setSelectedExtraPrompt("custom");
                  setNextDisabled(false);
                  // setForceUpdateForDropdown(oldValue => !oldValue)
                }}
              >
                {/* <div style={{textAlign: selectedDurationOption ? }}> */}
                <Select
                  defaultValue={defaultDurationOption}
                  options={durationOptions}
                  styles={styles}
                  placeholder="Duration"
                  isOptionDisabled={(option) => option.disabled}
                  onChange={setSelectedDurationOption}
                  formatOptionLabel={(option) => (
                    <>
                      {option.value === 60 && (
                        <div
                          style={{
                            // backgroundColor: option.disabled
                            //   ? "#c2c2c2"
                            //   : "#fff",
                            opacity: option.disabled ? 0.5 : 1,
                          }}
                        >
                          <OneMinuteIcon dimensions={"1.5em"} />
                        </div>
                      )}
                      {option.value === 180 && (
                        <div
                          style={{
                            // backgroundColor: option.disabled
                            //   ? "#c2c2c2"
                            //   : "#fff",
                            opacity: option.disabled ? 0.5 : 1,
                          }}
                        >
                          <ThreeMinuteIcon dimensions={"1.5em"} />
                        </div>
                      )}

                      {option.value === 300 && (
                        <div
                          style={{
                            // backgroundColor: option.disabled
                            //   ? "#c2c2c2"
                            //   : "#fff",
                            opacity: option.disabled ? 0.5 : 1,
                          }}
                        >
                          <FiveMinuteIcon dimensions={"1.5em"} />
                        </div>
                      )}
                    </>
                  )}
                />
                {/* </div> */}

                <Select
                  defaultValue={defaultAdjectiveOption}
                  options={adjectiveOptions}
                  styles={styles}
                  placeholder="Adjective"
                  isOptionDisabled={(option) => option.disabled}
                  onChange={setSelectedAdjectiveOption}
                />

                <Select
                  defaultValue={defaultNounOption}
                  options={nounOptions}
                  styles={styles}
                  placeholder="Noun"
                  isOptionDisabled={(option) => option.disabled}
                  onChange={setSelectedNounOption}
                />
              </div>
            </div>
          </div>

          <div
            id={"nextButton"}
            style={{
              position: "absolute",
              top: "375px",
              left: "43%",
              width: "75px",
              height: "40px",
              opacity: 0,
            }}
          >
            <button
              className={baseClasses.nextButton}
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
              top: 0,
              left: 0,
              // width: "475px",
              height: "275px",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{ height: "10em", marginTop: "1em" }}
              className={classes.registerPromoContainer}
            >
              <div className={classes.baseFlex}>
                <LogInButton forceShow={true} />
                <div>or</div>
                <LogInButton forceShow={false} />
              </div>

              <div style={{ width: "60%", textAlign: "center" }}>
                to choose your daily extra prompt and gain full access to all
                features!
              </div>
            </div>
          </div>
        </div>

        {showCountdownTimer && (
          <div
            className={`${classes.promptRefreshTimer} ${baseClasses.baseVertFlex}`}
          >
            <div>New prompts refresh in</div>
            <Countdown
              date={resetAtDate}
              renderer={formatTime}
              onComplete={() => setShowCountdownTimer(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptSelection;
