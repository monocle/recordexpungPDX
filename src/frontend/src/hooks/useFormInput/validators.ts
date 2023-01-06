import { capitalizeFirstLetter } from "./utils";

const validatorKeys = ["isNotEmpty", "isEmail", "isDate"] as const;

export type ValidatorKey = typeof validatorKeys[number];

function isNotEmpty(value: string) {
  return value !== "";
}

// returns true if the email is correct format: https://www.w3resource.com/javascript/form/email-validation.php
// empty or format != "_@_._" will return false
function isEmail(value: string) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
}

function isDate(value: string) {
  return false;
}

const validatorMap: {
  [key in ValidatorKey]: (value: string) => boolean;
} = {
  isNotEmpty,
  isEmail,
  isDate,
};

export default function getValidator(
  name: string,
  validate: ValidatorKey | undefined
) {
  let key: ValidatorKey = "isNotEmpty";
  const tryKey = "is" + capitalizeFirstLetter(name);

  if (validate) {
    key = validate;
  } else if ((validatorKeys as readonly string[]).includes(tryKey)) {
    key = tryKey as ValidatorKey;
  }

  return validatorMap[key];
}
