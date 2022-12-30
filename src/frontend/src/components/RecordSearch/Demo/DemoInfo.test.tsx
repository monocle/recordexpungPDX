import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DemoInfo from "./DemoInfo";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../redux/store";

render(
  <Provider store={store}>
    <DemoInfo />
  </Provider>,
  { wrapper: BrowserRouter }
);

it("Demo displays the demo related h tags", () => {
  expect(screen.getByText(/app demo/i)).toBeInTheDocument();
  expect(screen.getByText(/single conviction/i)).toBeInTheDocument();
  expect(screen.getByText(/multiple charges/i)).toBeInTheDocument();
  expect(screen.getAllByText(/john common/i)[0]).toBeInTheDocument();
  expect(screen.getByText(/class b felony/i)).toBeInTheDocument();
  expect(screen.getByText(/needs more analysis/i)).toBeInTheDocument();
  expect(screen.getAllByText(/first name/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/last name/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/date of birth/i)[0]).toBeInTheDocument();
});
