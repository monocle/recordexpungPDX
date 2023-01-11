import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../redux/store";
import demoRecord from "./demoRecord";
import Demo from "./index";

const mockDispatch = jest.fn();

jest.mock("../../redux/hooks", () => ({
  ...jest.requireActual("../../redux/hooks"),
  useAppDispatch: () => mockDispatch,
}));

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2023, 0, 8));
});

it("renders correctly", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <BrowserRouter>
          <Demo record={demoRecord} />
        </BrowserRouter>
      </Provider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

// TODO use integration test instead of this
it("dispatches the start demo action", () => {
  render(
    <Provider store={store}>
      <Demo />
    </Provider>,
    { wrapper: BrowserRouter }
  );

  expect(mockDispatch).toHaveBeenCalledWith({
    type: "demo/start",
    payload: undefined,
  });
});
