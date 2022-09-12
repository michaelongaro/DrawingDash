import React, { useState, useEffect, useContext } from "react";
import AutofillResult from "./AutofillResult";

import SearchContext from "./SearchContext";

import classes from "./SharedAutofillResults.module.css";

const UserResults = ({ users }) => {
  const searchCtx = useContext(SearchContext);

  useEffect(() => {
    if (searchCtx.userSearchValues["userSearch"] !== "") {
      getUsers();
    } else {
      searchCtx.updateUserSearchValues("requestedUsers", []);
    }
  }, [searchCtx.userSearchValues["userSearch"]]);

  function getUsers() {
    let results = [],
      related_results = [],
      totalResults = [];

    if (users === null) return;

    for (const user of Object.values(users)) {
      // finding the users that match or at least contain the user input

      const username = user["preferences"]["username"].toLowerCase();

      console.log(
        username,
        username.substring(0, searchCtx.userSearchValues["userSearch"].length),
        searchCtx.userSearchValues["userSearch"].toLowerCase(),
        username.substring(
          0,
          searchCtx.userSearchValues["userSearch"].length
        ) === searchCtx.userSearchValues["userSearch"].toLowerCase()
      );
      // checking for direct matches
      if (
        username.substring(
          0,
          searchCtx.userSearchValues["userSearch"].length
        ) === searchCtx.userSearchValues["userSearch"].toLowerCase()
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

    // finding (up to) first 5 alphabetical direct results (that are sorted roughly descending from
    // # of entries) and then first 3 alphabetical related results
    results.sort().splice(5);
    // properly capitalizing word
    results = results.map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.substring(1).toLowerCase();
    });

    related_results.sort().splice(3);
    // properly capitalizing word
    related_results = related_results.map((elem) => {
      return elem.charAt(0).toUpperCase() + elem.substring(1).toLowerCase();
    });

    if (results.length !== 0) {
      if (related_results.length !== 0) {
        // idk i don't think the look of "related" is the vibe here...
        // totalResults.push(results.concat(["related"]).concat(related_results));
      } else {
        totalResults.push(results);
      }

      // updating context
      searchCtx.updateUserSearchValues(
        "requestedUsers",
        ...new Set(totalResults)
      );
    } else {
      searchCtx.updateUserSearchValues("requestedUsers", []);
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
