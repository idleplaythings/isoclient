import React, { Component } from "react";
import { StoreProvider } from "./ui/UiState";
import UiRoot from "./ui/UiRoot";

class App extends Component {
  render() {
    return (
      <StoreProvider>
        <UiRoot />
      </StoreProvider>
    );
  }
}

export default App;
