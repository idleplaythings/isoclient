import React from "react";
import styled from "styled-components";

const StyledButton = styled.button({
  width: "100%",
  height: 20,
  textTransform: "uppercase",
  color: "#0a3340",
  border: "1px solid black",
  cursor: "pointer",
});

const Button = ({ children, onClick = () => {}, ...rest }) => {
  return (
    <StyledButton onClick={onClick} {...rest}>
      {children}
    </StyledButton>
  );
};

export default Button;
