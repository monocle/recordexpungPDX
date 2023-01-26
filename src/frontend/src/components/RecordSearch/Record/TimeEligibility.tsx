import React from "react";
import { TimeEligibilityData } from "./types";
import EligibilityReasons from "./EligibilityReasons";

interface Props {
  time_eligibility: TimeEligibilityData;
}

export default function TimeEligibility({ time_eligibility }: Props) {
  return <EligibilityReasons kind="time" eligibility={time_eligibility} />;
}
