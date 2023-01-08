import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";

import store from "../../redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Demo from "./index";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <BrowserRouter>
          <Demo />
        </BrowserRouter>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
