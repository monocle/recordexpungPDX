import React, { useState } from "react";

function validateEmail(email: string) {
  // returns true if the email is correct format: https://www.w3resource.com/javascript/form/email-validation.php
  // empty or format != "_@_._" will return false
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export default function useEmailInput({
  initialEmail = "",
  invalidMessage = "A valid email address is required",
}) {
  const [email, setEmail] = useState(initialEmail);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  const onChange = (e: React.BaseSyntheticEvent) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const onFocus = () => {
    setEmailErrors([]);
  };

  const onBlur = () => {
    if (!isValidEmail) {
      setEmailErrors([invalidMessage]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (!isValidEmail) {
      e.preventDefault();
      setEmailErrors([invalidMessage]);
    } else {
      setEmailErrors([]);
    }
  };

  const emailInputAttrs = {
    type: "email",
    name: "email",
    value: email,
    onFocus,
    onBlur,
    onChange,
  };

  return {
    email,
    isValidEmail,
    emailErrors,
    emailInputAttrs,
    handleFormSubmit,
  };
}
