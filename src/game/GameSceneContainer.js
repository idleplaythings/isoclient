import * as React from "react";
import styled from "styled-components";

const WebglCanvas = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

class GameSceneContainer extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const { game } = this.props;
    game.initRender(this.canvasRef.current);
  }

  render() {
    console.log("Render game scene container");
    return <WebglCanvas ref={this.canvasRef} />;
  }
}

export default GameSceneContainer;
