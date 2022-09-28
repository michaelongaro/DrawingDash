import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { SearchProvider } from "./components/search/SearchContext";
import { FavoritesProvider } from "./components/likes/FavoritesContext";
import { PinnedProvider } from "./components/profile/PinnedContext";
import { DrawingSelectionProvider } from "./components/canvas/DrawingSelectionContext";
import { ProfilePictureUpdateProvider } from "./components/profilePicture/ProfilePictureUpdateContext";
import { ModalProvider } from "./components/galleries/ModalContext";
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
      <ModalProvider>
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
      </ModalProvider>
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
