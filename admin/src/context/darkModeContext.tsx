import React, { createContext, PropsWithChildren, useReducer } from "react";
import darkModeReducer, { Action } from "./darkModeReducer";

export interface InitialState {
  darkMode: boolean;
  dispatch?: React.Dispatch<Action>;
}

const INITIAL_STATE: InitialState = {
  darkMode: false,
};

export const DarkModeContext = createContext(INITIAL_STATE);

export const DarkModeContextProvider = (props: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(darkModeReducer, INITIAL_STATE);
  return (
    <DarkModeContext.Provider value={{ darkMode: state.darkMode, dispatch }}>
      {props.children}
    </DarkModeContext.Provider>
  );
};
