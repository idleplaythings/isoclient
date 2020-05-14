import React, { useReducer, createContext /* useEffect */ } from "react";

export const StateStore = createContext({});
export const DispatchStore = createContext({});

export const UiStateMessages = {
  SET_USER_ID: "setUserId",
  SET_NETWORK_STATUS: "setNetworkStatus",
};

const initialState = {
  userId: undefined,
  networkStatus: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case UiStateMessages.SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
    case UiStateMessages.SET_NETWORK_STATUS:
      return {
        ...state,
        networkStatus: action.payload,
      };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /*
  useEffect(() => {
    getCurrentUser(dispatch);
  }, []);
  */

  return (
    <DispatchStore.Provider value={dispatch}>
      <StateStore.Provider value={state}>{children}</StateStore.Provider>
    </DispatchStore.Provider>
  );
};
