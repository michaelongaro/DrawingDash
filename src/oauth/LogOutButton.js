import { useState, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { getDatabase, ref, set, child, get, update } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

import { app } from "../util/init-firebase";

import { animals } from "../util/animals";
import LogOutIcon from "../svgs/LogOutIcon";

import classes from "./LogInButton.module.css";

const LogOutButton = ({ borderRadius = "0 0 1em 1em", gap = ".5em" }) => {
  const { logout, user, isLoading, isAuthenticated } = useAuth0();

  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));
  const storage = getStorage();

  const [extraPrompt, setExtraPrompt] = useState(null);

  // hover/click states for button
  const [buttonIsClicked, setButtonIsClicked] = useState(false);
  const [buttonIsHovered, setButtonIsHovered] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      let currentUserInfo = JSON.parse(
        localStorage.getItem("unregisteredUserInfo")
      );

      if (currentUserInfo) {
        get(child(dbRef, "users")).then((snapshot) => {
          if (snapshot.exists()) {
            const userAlreadyInDatabase = Object.keys(snapshot.val()).includes(
              user.sub
            );

            if (!userAlreadyInDatabase) {
              // add user data if user is new

              for (const index in Object.keys(
                currentUserInfo["drawingMetadata"]
              )) {
                // variables for cleaner database paths below
                const title = Object.values(currentUserInfo["drawingMetadata"])[
                  index
                ]["title"];
                const seconds = Object.values(
                  currentUserInfo["drawingMetadata"]
                )[index]["seconds"];
                const id = Object.values(currentUserInfo["drawingMetadata"])[
                  index
                ]["index"];

                // adding to drawingLikes
                set(ref(db, `drawingLikes/${seconds}/${id}`), {
                  dailyLikes: 0,
                  totalLikes: 0,
                });

                // adding to drawings
                set(
                  ref(db, `drawings/${id}`),
                  Object.values(currentUserInfo["drawingMetadata"])[index]
                );

                // adding drawing object to storage
                fetch(Object.values(currentUserInfo["drawings"])[index])
                  .then((res) => res.blob())
                  .then((blob) => {
                    var image = new Image();
                    image.src = blob;

                    var uploadTask = ref_storage(storage, `drawings/${id}.jpg`);
                    uploadBytes(uploadTask, blob, {
                      contentType: "image/jpeg",
                    });
                  });

                // addings to titles
                set(ref(db, `titles/${seconds}/${title}`), {
                  drawingID: [id],
                });

                // incrementing totalDrawings by one
                get(child(dbRef, "totalDrawings")).then((snapshot) => {
                  if (snapshot.exists()) {
                    let currentDrawings = snapshot.val()["count"];

                    set(ref(db, "totalDrawings"), {
                      count: currentDrawings + 1,
                    });
                  }
                });

                // adding drawing to user titles
                set(ref(db, `users/${user.sub}/titles/${seconds}/${id}`), {
                  drawingID: [id],
                });
              }

              // clearing localstorage so that if user ever logs out they can start fresh
              // since all of their data has been uploaded to their new account
              localStorage.removeItem("unregisteredUserInfo");
            }
          }
        });
      }

      get(child(dbRef, `users/${user.sub}/completedDailyPrompts`)).then(
        (snapshot) => {
          if (!snapshot.exists()) {
            set(
              ref(db, `users/${user.sub}/completedDailyPrompts`),
              currentUserInfo
                ? { ...currentUserInfo["dailyCompletedPrompts"], extra: false }
                : {
                    60: false,
                    180: false,
                    300: false,
                    extra: false,
                  }
            );
            set(ref(db, `users/${user.sub}/likes`), {
              60: false,
              180: false,
              300: false,
            });
            set(ref(db, `users/${user.sub}/pinnedArt`), {
              60: "",
              180: "",
              300: "",
            });

            // creating titles directory if it wasn't already there (needed?)
            get(child(dbRef, `users/${user.sub}/titles`)).then((snapshot2) => {
              if (!snapshot2.exists()) {
                set(ref(db, `users/${user.sub}/titles`), {
                  60: {},
                  180: {},
                  300: {},
                });
              }
            });
            createExtraPrompt();

            // setting default preferences (username, status, profile picture)

            fetch(
              "https://random-word-form.herokuapp.com/random/adjective"
            ).then((res) =>
              res.json().then((result) => {
                let formattedAdjective =
                  result[0].charAt(0).toUpperCase() +
                  result[0].substring(1).toLowerCase();
                let randomAnimal =
                  animals[Math.floor(Math.random() * animals.length)];

                set(ref(db, `users/${user.sub}/preferences`), {
                  username: `${formattedAdjective} ${randomAnimal}`,
                  status: "Eagerly awaiting tomorrow's prompts... 🎨",
                  defaultProfilePicture: user.picture,
                  profileCropMetadata: false,
                });
              })
            );

            // setting that user is visiting for the first time (used in welcome message)
            set(ref(db, `users/${user.sub}/firstTimeVisiting`), true);

            // incrementing totalUsers by one
            get(child(dbRef, "totalUsers")).then((snapshot) => {
              if (snapshot.exists()) {
                let currentUsers = snapshot.val()["count"];

                set(ref(db, "totalUsers"), {
                  count: currentUsers + 1,
                });
              }
            });
          }
        }
      );
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (extraPrompt) {
      set(ref(db, `users/${user.sub}/extraDailyPrompt`), extraPrompt);
    }
  }, [extraPrompt]);

  const capitalize = (s) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  function createExtraPrompt() {
    fetch("https://random-word-form.herokuapp.com/random/adjective")
      .then((response) => response.json())
      .then((data) => {
        return capitalize(data[0]);
      })
      .then((capAdj) => {
        fetch("https://random-word-form.herokuapp.com/random/noun")
          .then((response) => response.json())
          .then((data2) => {
            const capNoun = capitalize(data2[0]);
            return `${capAdj} ${capNoun}`;
          })
          .then((fullTitle) => {
            const seconds = [60, 180, 300];
            const randomSeconds =
              seconds[Math.floor(Math.random() * seconds.length)];

            setExtraPrompt({
              seconds: randomSeconds,
              title: fullTitle,
            });
          });
      });
  }

  return (
    isAuthenticated && (
      <button
        style={{
          backgroundColor: buttonIsClicked ? "#c2c2c2" : "#eeeeee",
          color: buttonIsClicked ? "white" : "black",
          borderColor: buttonIsHovered ? "#c2c2c2" : "#eeeeee",
          borderRadius: borderRadius,
          gap: gap,
        }}
        className={classes.logOut}
        onMouseDown={() => {
          setButtonIsClicked(true);
        }}
        onMouseEnter={() => {
          setButtonIsHovered(true);
        }}
        onMouseOut={() => {
          setButtonIsClicked(false);
          setButtonIsHovered(false);
        }}
        onClick={() =>
          logout({
            returnTo: window.location.origin,
          })
        }
      >
        <LogOutIcon
          dimensions={"1.5em"}
          color={buttonIsClicked ? "white" : "black"}
        />
        Log Out
      </button>
    )
  );
};

export default LogOutButton;
