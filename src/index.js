import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { SearchProvider } from "./components/layout/SearchContext";
import { FavoritesProvider } from "./components/layout/FavoritesContext";
import { PinnedProvider } from "./components/layout/PinnedContext";
import { DrawingSelectionProvider } from "./canvas/DrawingSelectionContext";
import { ProfilePictureUpdateProvider } from "./components/layout/ProfilePictureUpdateContext";
import App from "./App";

import "./fonts/VisbyRoundCF-Light.otf";
import "./fonts/VisbyRoundCF-Medium.otf";
import "./fonts/VisbyRoundCF-Regular.otf";

import "./index.module.css";

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-lshqttx0.us.auth0.com"
      clientId="HiuFz0Yo30naHcGzk8PbPOYr0qIK6dae"
      redirectUri={window.location.origin}
    >
      <ProfilePictureUpdateProvider>
        <PinnedProvider>
          <SearchProvider>
            <FavoritesProvider>
              <DrawingSelectionProvider>
                <App />
              </DrawingSelectionProvider>
            </FavoritesProvider>
          </SearchProvider>
        </PinnedProvider>
      </ProfilePictureUpdateProvider>
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
