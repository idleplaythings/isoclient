import React, { Component } from "react";
import { GameSceneContainer, Game } from "./game";

const game = new Game();

class App extends Component {
  render() {
    return <GameSceneContainer game={game} />;
  }
}

export default App;
