import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 40px;
  height: 40px;
  border: 2px solid black;
  background-color: rgba(0, 100, 255, 0.5);
`;

export const CreateArea = () => {
  return <Container>Area</Container>;
};
