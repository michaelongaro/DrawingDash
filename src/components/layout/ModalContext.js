import { createContext, useEffect, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider(props) {
  const [drawingModalOpened, setDrawingModalOpened] = useState(false);
  const [userModalOpened, setUserModalOpened] = useState(false);
  const [drawingModalFromUserOpened, setDrawingModalFromUserOpened] =
    useState(false);
  const [hideAllModals, setHideAllModals] = useState(false);

  const context = {
    drawingModalOpened: drawingModalOpened,
    setDrawingModalOpened: setDrawingModalOpened,
    userModalOpened: userModalOpened,
    setUserModalOpened: setUserModalOpened,
    drawingModalFromUserOpened: drawingModalFromUserOpened,
    setDrawingModalFromUserOpened: setDrawingModalFromUserOpened,
    hideAllModals: hideAllModals,
    setHideAllModals: setHideAllModals,
  };

  return (
    <ModalContext.Provider value={context}>
      {props.children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
