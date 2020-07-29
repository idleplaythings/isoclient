import React, { useContext } from "react";
import styled from "styled-components";
import { DispatchStore, UiStateMessages } from "../UiState";

const PostionElement = styled.div`
  widht: 0;
  height: 0;
  position: absolute;
  top: ${({ position }) => `${position.y}px`};
  left: ${({ position }) => `${position.x}px`};
`;

const Container = styled.div`
  width: 200px;
  color: white;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px;
  font-size: 16px;
  line-height: 18px;
`;

const ItemContainer = styled.div`
  cursor: pointer;
  padding: 0 8px;
  &:hover {
    background-color: white;
    color: black;
    font-weight: bold;
  }
`;

export const ContextMenu = ({ position, items }) => {
  const dispatch = useContext(DispatchStore);

  return (
    <PostionElement position={position}>
      <Container
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {items.map((item, i) => (
          <ItemContainer
            key={`context-menu-${i}`}
            onClick={() => {
              item.execute();
              dispatch({ type: UiStateMessages.CLOSE_CONTEXT_MENU });
            }}
          >
            {item.label}
          </ItemContainer>
        ))}
      </Container>
    </PostionElement>
  );
};
