import { useState, useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { getDatabase, ref, set, child, get, update } from "firebase/database";

import { app } from "../util/init-firebase";

const LogoutButton = () => {
  const { logout, user, isLoading, isAuthenticated } = useAuth0();
  const db = getDatabase(app);
  const dbRef = ref(getDatabase(app));

  const [extraPrompt, setExtraPrompt] = useState(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      get(child(dbRef, `users/${user.sub}/completedDailyPrompts`)).then(
        (snapshot) => {
          if (!snapshot.exists()) {
            set(ref(db, `users/${user.sub}/completedDailyPrompts`), {
              60: false,
              180: false,
              300: false,
              extra: false,
            });
            set(ref(db, `users/${user.sub}/likes`), {});
            createExtraPrompt();
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

  function createExtraPrompt() {
    fetch("https://random-word-form.herokuapp.com/random/adjective")
      .then((response) => response.json())
      .then((data) => {
        return data[0];
      })
      .then((adj) => {
        fetch("https://random-word-form.herokuapp.com/random/noun")
          .then((response) => response.json())
          .then((data2) => {
            return `${adj} ${data2[0]}`;
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
        onClick={() =>
          logout({
            returnTo: window.location.origin,
          })
        }
      >
        Log Out
      </button>
    )
  );
};

export default LogoutButton;
