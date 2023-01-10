import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../redux/store";
import demoRecord from "./demoRecord";
import Demo from "./index";

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
