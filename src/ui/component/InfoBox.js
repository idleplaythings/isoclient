import React from "react";
import styled from "styled-components";

const Container = styled.div({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "black",
  opacity: 0.5,
});

const InfoContainer = styled.div({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  width: 400,
  top: 200,
  left: "calc(50% - 200px)",
  right: "calc(50% - 200px)",
  border: "2px solid darkgray",
  borderRadius: "10px",
  backgroundColor: "black",
  opacity: 0.85,
  color: "lightGray",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
});

const InfoBox = ({ children }) => {
  return (
    <>
      <Container />
      <InfoContainer>{children}</InfoContainer>
    </>
  );
};

export default InfoBox;
