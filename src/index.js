import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import "./index.css";
import App from "./App";
import { WordsProvider } from "./canvas/WordsContext";
import { SearchProvider } from "./components/layout/SearchContext";
import { FavoritesProvider } from "./components/layout/FavoritesContext";
import { PinnedProvider } from "./components/layout/PinnedContext";
import { DrawingSelectionProvider } from "./canvas/DrawingSelectionContext";

ReactDOM.render(
  <PinnedProvider>
    <FavoritesProvider>
      <SearchProvider>
        <DrawingSelectionProvider>
          <WordsProvider>
            <BrowserRouter>
              <Auth0Provider
                domain="dev-lshqttx0.us.auth0.com"
                clientId="HiuFz0Yo30naHcGzk8PbPOYr0qIK6dae"
                redirectUri={window.location.origin}
              >
                <App />
              </Auth0Provider>
            </BrowserRouter>
          </WordsProvider>
        </DrawingSelectionProvider>
      </SearchProvider>
    </FavoritesProvider>
  </PinnedProvider>,
  document.getElementById("root")
);
