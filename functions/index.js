const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const axios = require("axios");

const database = admin.database();

async function fetchDailyWords() {
  const res = await Promise.all([
    axios.get("https://random-word-form.herokuapp.com/random/adjective"),
    axios.get("https://random-word-form.herokuapp.com/random/noun"),
    axios.get("https://random-word-form.herokuapp.com/random/adjective"),
    axios.get("https://random-word-form.herokuapp.com/random/noun"),
    axios.get("https://random-word-form.herokuapp.com/random/adjective"),
    axios.get("https://random-word-form.herokuapp.com/random/noun"),
  ]);
  return res;
}

async function fetchExtraDailyWords() {
  const res = await Promise.all([
    axios.get("https://random-word-form.herokuapp.com/random/adjective"),
    axios.get("https://random-word-form.herokuapp.com/random/noun"),
  ]);
  return res;
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

exports.dailyRefreshAndReset = functions.pubsub
  .schedule("every day 00:00")
  .timeZone("America/Chicago")
  .onRun((context) => {
    // starting reset process, resetting complete status to false
    database.ref(`resetComplete`).set(false);

    let promptsSet,
      statusesSet,
      resetComplete = false;

    // setting new daily prompts
    fetchDailyWords().then((response) => {
      const data = response.map((res) => res.data);
      const flattenedData = data.flat();

      database
        .ref("dailyPrompts")
        .set({
          60: `${capitalize(flattenedData[0])} ${capitalize(flattenedData[1])}`,
          180: `${capitalize(flattenedData[2])} ${capitalize(
            flattenedData[3]
          )}`,
          300: `${capitalize(flattenedData[4])} ${capitalize(
            flattenedData[5]
          )}`,
        })
        .then(() => {
          if (!resetComplete) {
            promptsSet = true;
            if (statusesSet) {
              database.ref(`resetComplete`).set(true);
              resetComplete = true;
            }
          }
        });
    });

    // this date is used as a reference to count down to inside of
    // PromptSelection.js & DrawingScreen.js
    const date = new Date(Date.now() + 86400000);
    const formattedDate = date.toDateString();

    database
      .ref(`masterDateToResetPromptsAt`)
      .set(`${formattedDate} 00:00:00 GMT-0500`);

    database
      .ref("users")
      .once("value")
      .then((snapshot) => {
        const users = Object.keys(snapshot.val());

        // for each user, resetting their completedDailyPrompts
        // + adding new extra prompt
        for (const user of users) {
          const seconds = [60, 180, 300];
          const randomSeconds =
            seconds[Math.floor(Math.random() * seconds.length)];

          fetchExtraDailyWords().then((response) => {
            const data = response.map((res) => res.data);
            const flattenedData = data.flat();

            database.ref(`users/${user}/extraDailyPrompt`).set({
              seconds: randomSeconds,
              title: `${capitalize(flattenedData[0])} ${capitalize(
                flattenedData[1]
              )}`,
            });
          });

          database
            .ref(`users/${user}/completedDailyPrompts`)
            .set({
              60: false,
              180: false,
              300: false,
              extra: false,
            })
            .then(() => {
              if (!resetComplete) {
                statusesSet = true;

                if (promptsSet) {
                  database.ref(`resetComplete`).set(true);
                  resetComplete = true;
                }
              }
            });
        }
      });

    database
      .ref("drawingLikes")
      .once("value")
      .then((snapshot) => {
        // getting yesterday's dailyMostLiked id's to compare to
        database
          .ref("dailyMostLiked")
          .once("value")
          .then((snapshot2) => {
            let previousDailyMostLiked = snapshot2.val();

            let newDailyMostLiked = {};

            const durations = Object.keys(snapshot.val());

            for (const duration of durations) {
              const drawingIDs = Object.keys(snapshot.val()[duration]);
              let mostLikedID = "";
              let mostLiked = 0;
              for (const drawingID of drawingIDs) {
                if (
                  snapshot.val()[duration][drawingID]["dailyLikes"] > mostLiked
                ) {
                  mostLikedID = drawingID;
                  mostLiked = snapshot.val()[duration][drawingID]["dailyLikes"];
                }

                database.ref(`drawingLikes/${duration}/${drawingID}`).update({
                  dailyLikes: 0,
                });
              }

              // if there were no drawings that were liked for that day (per duration)
              if (mostLikedID === "") {
                let randomDrawingWithLikesID = "";
                let likedImageNotFound = true;

                // looping through all indicies until one is found that has > 0 totalDrawings
                while (likedImageNotFound) {
                  let randomIndex = Math.floor(
                    Math.random() * drawingIDs.length
                  );

                  // making sure that drawing has likes + wasn't yesterday's most liked
                  if (
                    snapshot.val()[duration][drawingIDs[randomIndex]][
                      "totalLikes"
                    ] > 0 &&
                    previousDailyMostLiked[duration] !== drawingIDs[randomIndex]
                  ) {
                    randomDrawingWithLikesID = drawingIDs[randomIndex];
                    likedImageNotFound = false;
                  }
                }

                newDailyMostLiked[duration] = {
                  id: randomDrawingWithLikesID,
                };
              }

              // most liked image of that day (per duration)
              else {
                newDailyMostLiked[duration] = { id: mostLikedID };
              }
            }

            // setting newDailyMostLiked obj in db
            database.ref(`dailyMostLiked`).set(newDailyMostLiked);
          });
      });

    return null;
  });
