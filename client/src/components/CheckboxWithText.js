import styled from "styled-components";

import Checkbox from "./Checkbox";

const CheckboxWithTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 1.2rem;
  align-items: center;
  color: white;
  cursor: pointer;

  & > div {
    margin-left: 12px;
    text-align: left;

    & > span {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }
`;

const CheckboxWithText = ({ checked, children, ...otherProps }) => {
  return (
    <CheckboxWithTextWrapper {...otherProps}>
      <Checkbox checked={checked} />
      <div>{children}</div>
    </CheckboxWithTextWrapper>
  );
};

export default CheckboxWithText;
