import React, { useCallback, useState, useContext } from "react";
import styled from "styled-components";
import InfoBox from "./component/InfoBox";
import { InputAndLabel } from "./component/Input";
import * as Typography from "./component/Typography";
import Button from "./component/Button";
import { DispatchStore, UiStateMessages } from "./UiState";

const Login = () => {
  const dispatch = useContext(DispatchStore);
  const [username, setUsername] = useState(null);

  const handleUsernameChange = useCallback((event) => {
    const value = event.target.value;
    setUsername(value.trim());
  });

  const handleLogin = useCallback((event) => {
    if (!username) {
      return;
    }

    dispatch({
      type: UiStateMessages.SET_USER_ID,
      payload: parseInt(username, 10),
    });
  });

  return (
    <InfoBox>
      <Typography.H4>Input your user id</Typography.H4>
      <InputAndLabel type="text" onChange={handleUsernameChange} />
      <Button disabled={!Boolean(username)} onClick={handleLogin}>
        Login
      </Button>
    </InfoBox>
  );
};

export default Login;
