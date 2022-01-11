import styled from "styled-components";

const SelectionItem = styled.div`
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 1);
  padding: 12px;
  color: rgba(255, 255, 255, 1);
  font-size: 1.2rem;
  border-radius: 16px;
  transition: all 200ms ease;
  font-weight: 500;
  width: 48%;
  flex-shrink: 0;

  &.inactive {
    color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 1);
    border-color: rgba(255, 255, 255, 1);
  }

  &.active {
    color: #eac160;
    border-color: #eac160;
  }

  @media screen and (min-width: 960px) {
    max-width: 960px;
    box-shadow: none;
    flex-direction: row;
    padding: 20px;
  }
`;

export default SelectionItem;
