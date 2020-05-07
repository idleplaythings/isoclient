import * as React from "react";
import styled from "styled-components";

const WebglCanvas = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const getMousePositionInObservedElement = (event, element) => {
  if (event.touches) {
    return {
      x: event.originalEvent.touches[0].pageX - element.offset().left,
      y: event.originalEvent.touches[0].pageY - element.offset().top,
      xR:
        ((event.originalEvent.touches[0].pageX - element.offset().left) /
          window.innerWidth) *
          2 -
        1,
      yR:
        -(
          (event.originalEvent.touches[0].pageY - element.offset().top) /
          window.innerHeight
        ) *
          2 +
        1,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
    xR: (event.clientX / element.offsetWidth) * 2 - 1,
    yR: -(event.clientY / element.offsetHeight) * 2 + 1,
  };
};

class GameSceneContainer extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.canvasRef = React.createRef();
    this.mouseDownTimeStamp = null;
    this.draggingThreshold = 1000;
  }

  componentDidMount() {
    const { game } = this.props;

    window.addEventListener("resize", this.onResize);
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    game.initRender(this.canvasRef.current);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("keydown", this.onKeyDown.bind(this), false);
    document.removeEventListener("keyup", this.onKeyUp.bind(this), false);
  }

  onMouseDown(event) {
    console.log("onMouseDown");
    this.mouseDownTimeStamp = new Date().getTime();
  }

  onMouseUp(event) {
    console.log("onMouseUp");
    this.mouseDownTimeStamp = null;
    event.stopPropagation();
    event.preventDefault();
    const { game } = this.props;

    game.onMouseUp(
      getMousePositionInObservedElement(event, this.canvasRef.current)
    );
  }

  onMouseMove(event) {
    event.stopPropagation();
    event.preventDefault();

    const { game } = this.props;

    game.onMouseMove(
      getMousePositionInObservedElement(event, this.canvasRef.current)
    );
  }

  onKeyDown(event) {
    const { game } = this.props;
    game.camera.onKeyDown(event);
  }

  onResize = () => {
    const { game } = this.props;
    game.onResize();
  };

  onKeyUp(event) {
    const { game } = this.props;
    game.camera.onKeyUp(event);
  }

  render() {
    console.log("Render game scene container");
    return (
      <WebglCanvas
        ref={this.canvasRef}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
      />
    );
  }
}

export default GameSceneContainer;
