import React from "react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import { TypeEligibilityData } from "./types";
import TypeEligibility from "./TypeEligibility";

const typeEligibility = {
  status: "",
  reason: "a good reason",
};

function doRender(type_eligibility: TypeEligibilityData) {
  return renderer
    .create(<TypeEligibility type_eligibility={type_eligibility} />)
    .toJSON();
}

it("renders correctly for an 'Eligible' status", () => {
  const type_eligibility = { ...typeEligibility, status: "Eligible" };
  expect(doRender(type_eligibility)).toMatchSnapshot();
});

it("renders correctly for an 'Ineligible' status", () => {
  const type_eligibility = { ...typeEligibility, status: "Ineligible" };
  expect(doRender(type_eligibility)).toMatchSnapshot();
});

it("renders correctly for an 'Needs More Analysis' status", () => {
  const type_eligibility = {
    ...typeEligibility,
    status: "Needs More Analysis",
  };
  expect(doRender(type_eligibility)).toMatchSnapshot();
});

it("renders correctly for a non specific status", () => {
  const type_eligibility = { ...typeEligibility, status: "not a real status" };
  expect(doRender(type_eligibility)).toMatchSnapshot();
});
