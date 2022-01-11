import styled, { css } from "styled-components";

const Button = styled.div`
  cursor: pointer;
  background-color: #eac160;
  border-radius: 8px;
  width: 100%;
  padding: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #27465c;

  ${({ disabled }) =>
    !disabled &&
    css`
      &:hover {
        background-color: #edcd82;
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      background-color: #c4c4c4;
      color: #888;
    `}
`;

export default Button;
