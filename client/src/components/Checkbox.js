import styled from "styled-components";

import { ReactComponent as CheckedIcon } from "../assets/checked.svg";
import { ReactComponent as UncheckedIcon } from "../assets/unchecked.svg";

const StyledUncheckedIcon = styled(UncheckedIcon)`
  opacity: 0.8;
  transition: all 200ms ease;

  &.active {
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
`;

const Checkbox = ({ checked, size = 32, ...otherProps }) => {
  const IconComponent = checked ? CheckedIcon : StyledUncheckedIcon;

  return (
    <IconComponent
      {...otherProps}
      style={{
        cursor: "pointer",
        height: size,
        width: size,
      }}
    />
  );
};

export default Checkbox;
