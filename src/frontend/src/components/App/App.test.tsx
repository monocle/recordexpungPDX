import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "./index";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";

// TODO test Rules, Demo, FillFroms routing. Currently, these do not have
// links from the landing page.

describe("On landing", () => {
  beforeEach(() => {
    render(<App />, { wrapper: BrowserRouter });
  });

  it("displays the landing page header", () => {
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
    expect(screen.getAllByText(/general info/i)[0]).toBeInTheDocument();
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

it("displays the landing page for unknown routes", () => {
  const badRoute = "/foo";

  render(
    <MemoryRouter initialEntries={[badRoute]}>
      <App />
    </MemoryRouter>
  );

  expect(
    screen.getByText(/Making Record Expungement Affordable/i)
  ).toBeInTheDocument();
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
