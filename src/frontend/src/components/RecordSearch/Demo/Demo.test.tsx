import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Demo from "./index";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../redux/store";

render(
  <Provider store={store}>
    <Demo />
  </Provider>,
  { wrapper: BrowserRouter }
);

it("Demo displays the demo related h tags", () => {
  expect(screen.getByText(/app demo/i)).toBeInTheDocument();
  expect(screen.getByText(/single conviction/i)).toBeInTheDocument();
  expect(screen.getByText(/multiple charges/i)).toBeInTheDocument();
});
