import React, { useState } from "react";
import { capitalizeFirstLetter } from "./utils";
import getValidator, { ValidatorKey } from "./validators";

interface UseFormInputOptions {
  type?: string;
  initialValue?: string;
  invalidMessage?: string;
  validate?: ValidatorKey;
}

export default function useFormInput(
  name: string,
  {
    type = "text",
    initialValue = "",
    invalidMessage = "Valid input required",
    validate = undefined,
  }: UseFormInputOptions = {}
) {
  const validator = getValidator(name, validate);
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const onChange = (e: React.BaseSyntheticEvent) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsValid(validator(newValue));
  };

  const onFocus = () => {
    setErrors([]);
  };

  const onBlur = () => {
    if (!isValid) {
      setErrors([invalidMessage]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (!isValid) {
      e.preventDefault();
      setErrors([invalidMessage]);
    } else {
      setErrors([]);
    }
  };

  const availableTypes = ["password", "email", "date"];

  const inputProps = {
    id: name,
    type: availableTypes.includes(name) ? name : type,
    name: name,
    value: value,
    "aria-invalid": !isValid,
    onFocus,
    onBlur,
    onChange,
  };

  return {
    [name]: value,
    ["is" + capitalizeFirstLetter(name) + "Valid"]: isValid,
    [name + "Errors"]: errors,
    [name + "Props"]: inputProps,
    handleFormSubmit,
  } as {
    [key: string]: any;
  };
}
