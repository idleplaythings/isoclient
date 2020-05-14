import React from "react";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import styled from "styled-components";

const Container = styled.div({
  width: 80,
  height: 80,
  "> svg": {
    width: "100%",
    height: "100%",
  },
  animation: "rotation 2s infinite linear",

  "@keyframes rotation": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(359deg)",
    },
  },
});

const Loading = () => (
  <Container>
    <RotateRightIcon />
  </Container>
);

export default Loading;
