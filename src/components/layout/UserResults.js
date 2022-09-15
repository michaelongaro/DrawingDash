import React, { useEffect, useContext } from "react";
import AutofillResult from "./AutofillResult";

import SearchContext from "./SearchContext";

import classes from "./SharedAutofillResults.module.css";

const UserResults = ({ users }) => {
  const searchCtx = useContext(SearchContext);

  useEffect(() => {
    if (searchCtx.userSearchValues["userSearch"] !== "") {
      getUsers();
    } else {
      searchCtx.updateUserSearchValues({ requestedUsers: [] });
    }
  }, [searchCtx.userSearchValues["userSearch"]]);

  function getUsers() {
    let results = [],
      related_results = [],
      totalResults = [];

    if (users === null) return;

    for (const user of Object.values(users)) {
      const username = user["preferences"]["username"];

      // checking for direct matches
      if (
        username
          .substring(0, searchCtx.userSearchValues["userSearch"].length)
          .toLowerCase() ===
        searchCtx.userSearchValues["userSearch"].toLowerCase()
      ) {
        if (!results.includes(username)) {
          results.push(username);
        }
      }

      // checking for related usernames
      if (
        username.includes(
          searchCtx.userSearchValues["userSearch"].toLowerCase()
        )
      ) {
        if (!results.includes(username)) {
          related_results.push(username);
        }
      }
    }

    results.sort().splice(5);
    related_results.sort().splice(3);

    if (results.length !== 0) {
      totalResults.push(results);
      if (related_results.length !== 0) {
        totalResults.push(related_results);
      }

      // updating context
      searchCtx.updateUserSearchValues({
        requestedUsers: Array.from(new Set(totalResults))[0],
      });
    } else {
      searchCtx.updateUserSearchValues({ requestedUsers: [] });
    }
  }

  return (
    <div className={classes.listContain}>
      {searchCtx.userSearchValues["requestedUsers"].length !== 0 ? (
        searchCtx.userSearchValues["requestedUsers"].map((username) => (
          <AutofillResult
            key={username}
            word={username}
            type={"user"}
            idx={0}
          />
        ))
      ) : (
        <div className={classes.autofillRelatedDivider}>
          <div className={classes.leadingLine}></div>
          <div>No Results Found</div>
          <div className={classes.trailingLine}></div>
        </div>
      )}
    </div>
  );
};

export default UserResults;
