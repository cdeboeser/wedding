import React from "react";

import styled from "styled-components";

const TextFieldGroup = styled.div`
  position: relative;
  margin: 0;

  .form-input {
    color: #fff;
    font-size: 1.2rem;
    font-family: "Lora", serif;
    border: solid 1px rgba(255, 255, 255, 0.3);
    display: block;
    width: 100%;
    padding: ${({ type }) =>
      type === "password" ? "22px 48px 8px 12px" : "22px 12px 8px 12px"};
    border-radius: 8px;
    background: none;

    &:focus {
      outline: none;
    }

    &:focus ~ .form-input-label {
      top: 4px;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .form-input-label {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.2rem;
    position: absolute;
    pointer-events: none;
    left: 13px;
    top: 16px;
    transition: all 200ms ease;

    &.shrink {
      top: 4px;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.3);
    }
  }
`;

const TextField = ({
  handleChange,
  value,
  type,
  label,
  disabled,
  autoFocus,
  ...otherProps
}) => {
  return (
    <TextFieldGroup type={type} disabled={disabled}>
      <input
        className="form-input"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        autoFocus={autoFocus}
        {...otherProps}
      />
      {label ? (
        <label className={`${value.length ? "shrink" : ""} form-input-label`}>
          {label}
        </label>
      ) : null}
    </TextFieldGroup>
  );
};

export default TextField;
