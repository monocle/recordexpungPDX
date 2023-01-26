import React from "react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import { TimeEligibilityData } from "./types";
import TimeEligibility from "./TimeEligibility";

const timeEligibility = {
  status: "",
  reason: "a good reason",
  date_will_be_eligible: "a long time",
};

function doRender(time_eligibility: TimeEligibilityData) {
  return renderer
    .create(<TimeEligibility time_eligibility={time_eligibility} />)
    .toJSON();
}

it("renders correctly for an 'Eligible' status", () => {
  const time_eligibility = { ...timeEligibility, status: "Eligible" };
  expect(doRender(time_eligibility)).toMatchSnapshot();
});

it("renders correctly for a non specific status", () => {
  const time_eligibility = { ...timeEligibility, status: "not a real status" };
  expect(doRender(time_eligibility)).toMatchSnapshot();
});
