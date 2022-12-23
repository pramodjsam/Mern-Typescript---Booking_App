import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useReducer,
} from "react";

interface IInitialState {
  user: any;
  loading: boolean;
  error: any;
  dispatch?: React.Dispatch<Action>;
}

const INITIAL_STATE: IInitialState = {
  user: JSON.parse(localStorage.getItem("user")!) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

type ActionMap = {
  LOGIN_START: IInitialState;
  LOGIN_SUCCESS: IInitialState;
  LOGIN_FAILURE: IInitialState;
  LOGOUT: IInitialState;
};

export type Action = {
  [key in keyof ActionMap]: {
    type: key;
    payload?: any;
  };
}[keyof ActionMap];

const authReducer = (state: IInitialState, action: Action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { user: null, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false, error: null };
    case "LOGIN_FAILURE":
      return { user: null, loading: false, error: action.payload };
    case "LOGOUT":
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

export const AuthContextProvider = (props: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
