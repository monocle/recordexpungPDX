import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen, Screen, queries } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PartnerInterest from "./index";

function assertPresentInvalidEmailMessage(screen: Screen<typeof queries>) {
  expect(
    screen.queryByText(/valid email address is required/i)
  ).toBeInTheDocument();
}

function assertNotPresentInvalidEmailMessage(screen: Screen<typeof queries>) {
  expect(
    screen.queryByText(/valid email address is required/i)
  ).not.toBeInTheDocument();
}

beforeEach(() => {
  render(<PartnerInterest subscribeEndpoint="/" />, {
    wrapper: BrowserRouter,
  });
});

describe("PartnerInterest", () => {
  it("displays expected content", () => {
    expect(screen.getByText(/provide expungement help/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
    assertNotPresentInvalidEmailMessage(screen);
  });
});

describe("Email validation", () => {
  it("does not display error on email input focus", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByLabelText(/email/i));
    assertNotPresentInvalidEmailMessage(screen);
  });

  it("does not display an error message if leaving the email input in a valid state", async () => {
    const user = userEvent.setup();
    const input = screen.getByLabelText(/email/i);

    await user.type(input, "foo@bar.com");
    expect(input).toHaveValue("foo@bar.com");

    await user.click(screen.getByLabelText(/name/i));
    assertNotPresentInvalidEmailMessage(screen);
  });

  // Unable to get this to work:
  // it("does not display an error message if submitting the form with a valid email", async () => {
  //   global.window.HTMLFormElement.prototype.submit = () => {};
  //   const user = userEvent.setup();
  //   const input = screen.getByLabelText(/email/i);

  //   await user.type(input, "foo@bar.com");
  //   expect(input).toHaveValue("foo@bar.com");

  //   await user.click(screen.getByRole("button", { name: /subscribe/i }));
  //   assertNotPresentInvalidEmailMessage(screen);
  // });

  it("displays an error message if Subscribing with an blank email", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    assertPresentInvalidEmailMessage(screen);
  });

  it("displays an error message if leaving the email input in an invalid state", async () => {
    const user = userEvent.setup();
    const input = screen.getByLabelText(/email/i);

    await user.type(input, "foo@bar.");
    expect(input).toHaveValue("foo@bar.");

    await user.click(screen.getByLabelText(/name/i));
    assertPresentInvalidEmailMessage(screen);
  });

  it("removes an error message if the email input is refocused on", async () => {
    const user = userEvent.setup();
    const input = screen.getByLabelText(/email/i);

    await user.type(input, "foo@bar.");
    expect(input).toHaveValue("foo@bar.");

    await user.click(screen.getByLabelText(/name/i));
    assertPresentInvalidEmailMessage(screen);

    await user.click(input);
    assertNotPresentInvalidEmailMessage(screen);
  });
});
