import React, { useReducer, createContext /* useEffect */ } from "react";

export const StateStore = createContext({});
export const DispatchStore = createContext({});

export const UiStateMessages = {
  SET_USER_ID: "setUserId",
  SET_NETWORK_STATUS: "setNetworkStatus",
  SET_CURSOR_MODE: "setCursorMode",
  OPEN_CONTEXT_MENU: "openContextMenu",
  CLOSE_CONTEXT_MENU: "closeContextMenu",
};

const initialState = {
  userId: undefined,
  networkStatus: undefined,
  cursorMode: undefined,
  contextMenu: null,
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
    case UiStateMessages.SET_CURSOR_MODE:
      return {
        ...state,
        cursorMode: action.payload,
      };
    case UiStateMessages.OPEN_CONTEXT_MENU:
      return {
        ...state,
        contextMenu: action.payload,
      };
    case UiStateMessages.CLOSE_CONTEXT_MENU:
      if (state.contextMenu) {
        return {
          ...state,
          contextMenu: null,
        };
      }

      return state;
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
