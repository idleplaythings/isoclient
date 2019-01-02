import React, { Component } from "react";
import { GameSceneContainer, Game } from "./game";

class App extends Component {
  render() {
    const game = new Game();
    return <GameSceneContainer game={game} />;
  }
}

export default App;
