import React from "react";
import { TypeEligibilityData } from "./types";
import EligibilityReasons from "./EligibilityReasons";

interface Props {
  type_eligibility: TypeEligibilityData;
}

export default function TypeEligibility({ type_eligibility }: Props) {
  return <EligibilityReasons kind="type" eligibility={type_eligibility} />;
}
