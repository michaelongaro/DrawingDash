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

exports.pushDailyWords = functions.pubsub
  .schedule("every day 00:00")
  .timeZone("America/Chicago")
  .onRun((context) => {
    fetchDailyWords().then((response) => {
      const data = response.map((res) => res.data);
      const flattenedData = data.flat();

      database.ref("dailyPrompts/").set({
        60: `${capitalize(flattenedData[0])} ${capitalize(flattenedData[1])}`,
        180: `${capitalize(flattenedData[2])} ${capitalize(flattenedData[3])}`,
        300: `${capitalize(flattenedData[4])} ${capitalize(flattenedData[5])}`,
      });
    });

    database
      .ref("users")
      .once("value")
      .then((snapshot) => {
        const users = Object.keys(snapshot.val());
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

          database.ref(`users/${user}/completedDailyPrompts`).set({
            60: false,
            180: false,
            300: false,
            extra: false,
          });
        }
      });

    database
      .ref("drawingLikes")
      .once("value")
      .then((snapshot) => {
        const timeBrackets = Object.keys(snapshot.val());
        for (const timeBracket of timeBrackets) {
          const drawingIDs = Object.keys(snapshot.val()[timeBracket]);
          let mostLikedID = "";
          let mostLiked = 0;
          for (const drawingID of drawingIDs) {
            if (
              snapshot.val()[timeBracket][drawingID]["dailyLikes"] > mostLiked
            ) {
              mostLikedID = drawingID;
              mostLiked = snapshot.val()[timeBracket][drawingID]["dailyLikes"];
            }

            database.ref(`drawingLikes/${timeBracket}/${drawingID}`).update({
              dailyLikes: 0,
            });
          }

          if (mostLikedID !== "") {
            database.ref(`dailyMostLiked`).update({
              [timeBracket]: { id: mostLikedID },
            });
          }
        }
      });

    return null;
  });
