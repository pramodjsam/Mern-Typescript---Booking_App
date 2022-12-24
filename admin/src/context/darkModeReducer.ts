import { InitialState } from "./darkModeContext";

type ActionMap = {
  LIGHT: InitialState;
  DARK: InitialState;
  TOGGLE: InitialState;
};

export type Action = {
  [key in keyof ActionMap]: {
    type: key;
  };
}[keyof ActionMap];

const darkModeReducer = (state: InitialState, action: Action) => {
  switch (action.type) {
    case "LIGHT":
      return {
        darkMode: false,
      };
    case "DARK":
      return {
        darkMode: true,
      };
    case "TOGGLE":
      return {
        darkMode: !state.darkMode,
      };
    default:
      return state;
  }
};

export default darkModeReducer;
