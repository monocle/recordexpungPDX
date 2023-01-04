import React from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";

import store from "../../redux/store";
import App from "./index";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe("On landing", () => {
  beforeEach(() => {
    render(<App />, { wrapper: BrowserRouter });
  });

  it("displays the landing page heading", () => {
    expect(global.window.document.title).toBe("Home - RecordSponge");
    expect(
      screen.getByText(/Making Record Expungement Affordable/i)
    ).toBeInTheDocument();
  });

  it("can go to the Manual page", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/manual/i)[0]);

    expect(global.window.document.title).toBe("Manual - RecordSponge");
    expect(screen.getAllByText(/introduction/i)[0]).toBeInTheDocument();
  });

  it("can go to the About Us page", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/about us/i)[0]);

    expect(global.window.document.title).toBe("About - RecordSponge");
    expect(screen.getAllByText(/our mission/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/our team/i)[0]).toBeInTheDocument();
  });

  it("can go to the Partner page", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/hey partner/i)[0]);

    expect(global.window.document.title).toBe("Partner with us - RecordSponge");
    expect(
      screen.getAllByText(/provide expungement help/i)[0]
    ).toBeInTheDocument();
    expect(screen.getAllByText(/email address/i)[0]).toBeInTheDocument();
  });

  it("can go to the FAQ page", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/FAQ/)[0]);

    expect(global.window.document.title).toBe(
      "Frequently Asked Questions - RecordSponge"
    );
    expect(screen.getAllByText(/FAQ/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Myth/i)[0]).toBeInTheDocument();
  });

  it("can go to the Appendix page", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/appendix/i)[0]);

    expect(global.window.document.title).toBe("Appendix - RecordSponge");
    expect(screen.getAllByText(/appendix/i)[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(/forms to file for expungement/i)[0]
    ).toBeInTheDocument();
  });

  it("can go to the Accessibility page", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/accessibility statement/i)[0]);

    expect(global.window.document.title).toBe(
      "Accessibility Statement - RecordSponge"
    );
    expect(
      screen.getAllByText(/accessibility statement/i)[0]
    ).toBeInTheDocument();
    expect(screen.getAllByText(/conformance status/i)[0]).toBeInTheDocument();
  });

  it("can go to the Privacy Policy page", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByText(/privacy policy/i)[0]);

    expect(global.window.document.title).toBe("Privacy Policy - RecordSponge");
    expect(screen.getAllByText(/privacy policy/i)[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(/what we collect and why/i)[0]
    ).toBeInTheDocument();
  });
});

describe("The landing page Search button", () => {
  it("goes to the OECI log in page", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
      { wrapper: BrowserRouter }
    );
    await user.click(screen.getAllByText(/search/i)[0]);

    expect(global.window.document.title).toBe("Log In - RecordSponge");
    expect(
      screen.getAllByText(/oregon ecourt case information/i)[0]
    ).toBeInTheDocument();
    expect(screen.getAllByText(/log in to oeci/i)[0]).toBeInTheDocument();
  });
});

// TODO test Rules, Demo routing.

describe("Remaining app routes", () => {
  // This is the current production behavior, but it may not be intended.
  it("can go to /fill-expungement-forms", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/fill-expungement-forms"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/generate expungement forms/i)).toBeInTheDocument();
    expect(screen.getAllByText(/user information/i)[0]).toBeInTheDocument();
  });

  it("displays the landing page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/foo"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Making Record Expungement Affordable/i)
    ).toBeInTheDocument();
  });
});
