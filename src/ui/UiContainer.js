import React, { useContext, useMemo } from "react";
import { StateStore } from "./UiState";
import NetworkInfo from "./NetworkInfo";
import { CreateArea } from "./component/baseManagement/CreateArea";
import { ContextMenu } from "./component/ContextMenu";

const UiContainer = () => {
  const { networkStatus, contextMenu } = useContext(StateStore);

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

  return (
    <>
      {NetworkComponent}
      <CreateArea />
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          items={contextMenu.menuItems}
        />
      )}
    </>
  );
};

export default UiContainer;
