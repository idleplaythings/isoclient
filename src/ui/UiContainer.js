import React, { useContext, useMemo } from "react";
import { StateStore } from "./UiState";
import NetworkInfo from "./NetworkInfo";

const UiContainer = () => {
  const { networkStatus } = useContext(StateStore);

  console.log(networkStatus);
  //const Error = getError(state)

  const NetworkComponent = useMemo(
    () => {
      if (networkStatus && networkStatus.error) {
        return (
          <NetworkInfo
            error={networkStatus.error}
            callback={networkStatus.callback}
          />
        );
      }
      return null;
    },
    [networkStatus]
  );

  return <>{NetworkComponent}</>;
};

export default UiContainer;
