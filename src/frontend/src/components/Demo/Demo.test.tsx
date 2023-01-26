import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import Demo from ".";
import johnCommonRecord from "../../data/demo/johnCommon";
import multipleChargesRecord from "../../data/demo/multipleCharges";
import blankRecord from "../../data/blankRecord";

const mockUseAppSelector = jest.fn();

jest.mock("../../redux/hooks", () => ({
  ...jest.requireActual("../../redux/hooks"),
  useAppSelector: () => mockUseAppSelector(),
}));

function doRender() {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Demo />
      </MemoryRouter>
    </Provider>
  );
}

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2023, 0, 11));
});

afterAll(() => {
  jest.useRealTimers();
});

it("renders correctly without a record", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <MemoryRouter>
          <Demo />
        </MemoryRouter>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders correctly with John Common demo record", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <MemoryRouter>
          <Demo record={johnCommonRecord} />
        </MemoryRouter>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders correctly with Multiple Charges demo record", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <MemoryRouter>
          <Demo record={multipleChargesRecord} />
        </MemoryRouter>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders correctly with an empty record", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <MemoryRouter>
          <Demo record={blankRecord} />
        </MemoryRouter>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe("Without a record", () => {
  it("calls useAppSelector", () => {
    doRender();
    expect(mockUseAppSelector).toHaveBeenCalled();
  });

  it("dispatches the stop demo action", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    doRender();
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "START_DEMO",
    });
  });

  it("displays the correct document title", () => {
    doRender();
    expect(global.window.document.title).toBe("Demo - RecordSponge");
  });

  it("does not display search summary", () => {
    expect(screen.queryByText(/search summary/i)).not.toBeInTheDocument();
  });
});
