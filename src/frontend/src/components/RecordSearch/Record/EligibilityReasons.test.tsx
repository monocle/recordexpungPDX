import React from "react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import { TimeEligibilityData, TypeEligibilityData } from "./types";
import EligibilityReasons from "./EligibilityReasons";

const timeEligibility = {
  status: "",
  reason: "a good reason",
  date_will_be_eligible: "a long time",
};

function doRenderTime(time_eligibility: TimeEligibilityData) {
  return renderer
    .create(<EligibilityReasons kind="time" eligibility={time_eligibility} />)
    .toJSON();
}

describe("For time eligibility", () => {
  it("renders correctly for an 'Eligible' status", () => {
    const time_eligibility = { ...timeEligibility, status: "Eligible" };
    expect(doRenderTime(time_eligibility)).toMatchSnapshot();
  });

  it("renders correctly for a non specific status", () => {
    const time_eligibility = {
      ...timeEligibility,
      status: "not a real status",
    };
    expect(doRenderTime(time_eligibility)).toMatchSnapshot();
  });
});

const typeEligibility = {
  status: "",
  reason: "a good reason",
};

function doRenderType(type_eligibility: TypeEligibilityData) {
  return renderer
    .create(<EligibilityReasons kind="type" eligibility={type_eligibility} />)
    .toJSON();
}

describe("For type eligibility", () => {
  it("renders correctly for an 'Eligible' status", () => {
    const type_eligibility = { ...typeEligibility, status: "Eligible" };
    expect(doRenderType(type_eligibility)).toMatchSnapshot();
  });

  it("renders correctly for an 'Ineligible' status", () => {
    const type_eligibility = { ...typeEligibility, status: "Ineligible" };
    expect(doRenderType(type_eligibility)).toMatchSnapshot();
  });

  it("renders correctly for an 'Needs More Analysis' status", () => {
    const type_eligibility = {
      ...typeEligibility,
      status: "Needs More Analysis",
    };
    expect(doRenderType(type_eligibility)).toMatchSnapshot();
  });

  it("renders correctly for a non specific status", () => {
    const type_eligibility = {
      ...typeEligibility,
      status: "not a real status",
    };
    expect(doRenderType(type_eligibility)).toMatchSnapshot();
  });
});
