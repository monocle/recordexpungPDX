import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderer from "react-test-renderer";
import OeciLogin from ".";
import oeciLogIn from "../../service/oeci";

jest.mock("../../service/oeci", () => jest.fn());

it("OeciLogin renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <OeciLogin />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

beforeEach(() => {
  render(<OeciLogin />, { wrapper: BrowserRouter });
});

describe("Form validation", () => {
  it("displays an error message if all the fields are blank", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /log in to oeci/i }));

    expect(screen.queryByText(/all fields are required/i)).toBeInTheDocument();
  });

  it("displays an error message if only user ID is filled out", async () => {
    const user = userEvent.setup();
    const input = screen.getByLabelText(/user id/i);

    await user.type(input, "foo");
    expect(input).toHaveValue("foo");

    await user.click(screen.getByRole("button", { name: /log in to oeci/i }));

    expect(screen.queryByText(/all fields are required/i)).toBeInTheDocument();
  });

  it("displays an error message if only password is filled out", async () => {
    const user = userEvent.setup();
    const input = screen.getByLabelText(/password/i);

    await user.type(input, "password");
    expect(input).toHaveValue("password");

    await user.click(screen.getByRole("button", { name: /log in to oeci/i }));

    expect(screen.queryByText(/all fields are required/i)).toBeInTheDocument();
  });
});

describe("Login error handling", () => {
  it("successful login has no errors", async () => {
    const user = userEvent.setup();
    const userIdInput = screen.getByLabelText(/user id/i);
    const pwInput = screen.getByLabelText(/password/i);

    (oeciLogIn as jest.Mock).mockResolvedValue({});
    await user.type(userIdInput, "foo");
    expect(userIdInput).toHaveValue("foo");

    await user.type(pwInput, "password");
    expect(pwInput).toHaveValue("password");

    await user.click(screen.getByRole("button", { name: /log in to oeci/i }));

    expect(
      screen.queryByText(/all fields are required/i)
    ).not.toBeInTheDocument();
  });

  [401, 404].forEach((status) => {
    it(`a ${status} response displays the returned error message`, async () => {
      const user = userEvent.setup();
      const userIdInput = screen.getByLabelText(/user id/i);
      const pwInput = screen.getByLabelText(/password/i);

      (oeciLogIn as jest.Mock).mockImplementation(() => {
        return new Promise(() => {
          const error = {
            response: {
              status: status,
              data: {
                message: "it broke",
              },
            },
          };
          throw error;
        });
      });

      await user.type(userIdInput, "foo");
      expect(userIdInput).toHaveValue("foo");

      await user.type(pwInput, "password");
      expect(pwInput).toHaveValue("password");

      await user.click(screen.getByRole("button", { name: /log in to oeci/i }));

      expect(screen.queryByText(/it broke/i)).toBeInTheDocument();
    });
  });

  it(`any other error displays a generic error message`, async () => {
    const user = userEvent.setup();
    const userIdInput = screen.getByLabelText(/user id/i);
    const pwInput = screen.getByLabelText(/password/i);

    (oeciLogIn as jest.Mock).mockImplementation(() => {
      return new Promise(() => {
        const error = {
          response: {
            status: 500,
          },
        };
        throw error;
      });
    });

    await user.type(userIdInput, "foo");
    expect(userIdInput).toHaveValue("foo");

    await user.type(pwInput, "password");
    expect(pwInput).toHaveValue("password");

    await user.click(screen.getByRole("button", { name: /log in to oeci/i }));
    expect(screen.queryByText(/it broke/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/experiencing technical difficulties/i)
    ).toBeInTheDocument();
  });
});
