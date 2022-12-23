import React, { createContext, PropsWithChildren, useReducer } from "react";

interface IInitialState {
  city: undefined | string;
  dates: [{ endDate: Date; startDate: Date }];
  options: {
    adult: undefined | number;
    children: undefined | number;
    room: number;
  };
  dispatch?: React.Dispatch<Action>;
}

const INITIAL_STATE: IInitialState = {
  city: undefined,
  dates: [{ endDate: new Date(), startDate: new Date() }],
  options: {
    adult: undefined,
    children: undefined,
    room: 1,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

type ActionMap = {
  NEW_SEARCH: IInitialState;
  RESET_SEARCH: IInitialState;
};

export type Action = {
  [key in keyof ActionMap]: {
    type: key;
    payload: ActionMap[key];
  };
}[keyof ActionMap];

const searchReducer = (state: IInitialState, action: Action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = (props: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(searchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};
