import React, { useEffect, useContext } from "react";
import AutofillResult from "../search/AutofillResult";

import SearchContext from "../search/SearchContext";

import classes from "../search/SharedAutofillResults.module.css";

const UserResults = ({ users }) => {
  const searchCtx = useContext(SearchContext);

  const userSearch = searchCtx.userSearchValues["userSearch"];

  useEffect(() => {
    if (userSearch !== "") {
      getUsers();
    } else {
      searchCtx.updateUserSearchValues({ requestedUsers: [] });
    }
  }, [userSearch]);

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
        username
          .toLowerCase()
          .includes(searchCtx.userSearchValues["userSearch"].toLowerCase())
      ) {
        if (!results.includes(username)) {
          related_results.push(username);
        }
      }
    }

    results.sort().splice(5);
    related_results.sort().splice(3);

    totalResults = totalResults.concat(results).concat(related_results);
    if (totalResults.length !== 0) {
      // updating context
      searchCtx.updateUserSearchValues({
        requestedUsers: Array.from(new Set(totalResults)),
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
