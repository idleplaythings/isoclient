import React, { useMemo, useContext } from "react";
import styled from "styled-components";
import { Game, GameSceneContainer } from "../game";
import { StateStore, DispatchStore } from "./UiState";
import Login from "./Login";
import UiContainer from "./UiContainer";

const Container = styled.div({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  overflow: "hidden",
});

const UiRoot = () => {
  const state = useContext(StateStore);
  const dispatch = useContext(DispatchStore);

  const { userId } = state;

  const GameComponent = useMemo(
    () => {
      if (!userId) {
        return <></>;
      }

      const game = new Game(dispatch, userId);
      const Component = <GameSceneContainer game={game} />;
      return Component;
    },
    [userId, dispatch]
  );

  return (
    <Container>
      {!userId && <Login />}
      {GameComponent}
      <UiContainer />
    </Container>
  );
};

export default UiRoot;
