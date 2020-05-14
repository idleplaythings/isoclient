import React from "react";
import InfoBox from "./component/InfoBox";
import * as Typography from "./component/Typography";
import Loading from "./component/Loading";
import Button from "./component/Button";

const NetworkInfo = ({ error, callback }) => {
  if (error === "duplicate") {
    return (
      <InfoBox>
        <Typography.H4>Game open on other tab or device</Typography.H4>
        <Button onClick={callback}>Use here</Button>
      </InfoBox>
    );
  }

  return (
    <InfoBox>
      <Typography.H4>Unable to connect to the server</Typography.H4>
      <Loading />
      <Typography.H4>Retrying...</Typography.H4>
    </InfoBox>
  );
};

export default NetworkInfo;
