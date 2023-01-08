import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import store from "../../redux/store";
import RecordSearch from ".";

const mockHasOeciToken = jest.fn();

jest.mock("../../service/cookie-service", () => ({
  ...jest.requireActual("../../service/cookie-service"),
  hasOeciToken: () => mockHasOeciToken(),
}));

function renderRecordSearch() {
  render(
    <Provider store={store}>
      <RecordSearch />
    </Provider>,
    { wrapper: BrowserRouter }
  );
}

describe("Initial page display", () => {
  it("shows OeciLogin if not logged in", () => {
    renderRecordSearch();
    expect(screen.queryByText(/user id/i)).toBeInTheDocument();
    expect(screen.queryByText(/password/i)).toBeInTheDocument();
  });

  it("shows RecordSearch if logged in", () => {
    mockHasOeciToken.mockImplementationOnce(() => true);
    renderRecordSearch();

    expect(mockHasOeciToken).toHaveBeenCalled();
    expect(screen.queryByText(/expunge date/i)).toBeInTheDocument();
    expect(screen.queryByText(/assumptions/i)).toBeInTheDocument();
    expect(screen.queryByText(/enable editing/i)).toBeInTheDocument();
  });
});
