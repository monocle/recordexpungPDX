import { useState } from "react";

function validateEmail(email: string) {
  // returns true if the email is correct format: https://www.w3resource.com/javascript/form/email-validation.php
  // empty or format != "_@_._" will return false
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export default function useEmail(initialEmail: string = "") {
  const [email, setEmail_] = useState(initialEmail);
  const [isValidEmail, setIsValidEmail] = useState(false);

  function setEmail(newEmail: string) {
    setEmail_(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  }

  return [email, isValidEmail, setEmail] as const;
}
