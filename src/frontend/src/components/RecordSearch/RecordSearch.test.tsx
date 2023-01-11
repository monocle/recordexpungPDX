import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import store from "../../redux/store";
import RecordSearch from ".";

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../redux/hooks", () => ({
  ...jest.requireActual("../../redux/hooks"),
  useAppDispatch: () => mockDispatch,
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
  // TODO use integration test instead of this
  it("dispatches the stop demo action", () => {
    renderRecordSearch();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "demo/stop",
      payload: undefined,
    });
  });

  // TODO use integration test instead of this
  it("shows OeciLogin if not logged in", () => {
    renderRecordSearch();
    expect(mockNavigate).toHaveBeenCalledWith("/oeci", { replace: true });
  });

  it("shows RecordSearch if logged in", () => {
    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value: "oeci_token=1;",
    });

    renderRecordSearch();

    expect(screen.queryByText(/expunge date/i)).toBeInTheDocument();
    expect(screen.queryByText(/assumptions/i)).toBeInTheDocument();
    expect(screen.queryByText(/enable editing/i)).toBeInTheDocument();
  });
});
