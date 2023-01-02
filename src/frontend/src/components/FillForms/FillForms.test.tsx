import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import store from "../../redux/store";
import FillForms from "./index";

describe("FillForm", () => {
  it("displays FillForm and UserDataForm content", () => {
    render(
      <Provider store={store}>
        <FillForms />
      </Provider>,
      { wrapper: BrowserRouter }
    );

    expect(screen.getByText(/generate expungement forms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/user information/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/full name/i)).toBeInTheDocument();
    expect(screen.getByText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByText(/mailing street address/i)).toBeInTheDocument();
    expect(screen.getByText(/city/i)).toBeInTheDocument();
    expect(screen.getAllByText(/state/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number/i)).toBeInTheDocument();
  });
});
