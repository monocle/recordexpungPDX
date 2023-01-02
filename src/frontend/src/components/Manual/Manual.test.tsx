import React from "react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Manual from "./index";

beforeEach(() => {
  render(<Manual />, { wrapper: BrowserRouter });
});

test("Manual displays the manual and editing guide content", () => {
  expect(screen.getAllByText(/introduction/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/general info/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/use recordsponge/i)[0]).toBeInTheDocument();
  expect(screen.getByText(/editing guide/i)).toBeInTheDocument();
});

test("Editing guide is initially hidden but can be opened", async () => {
  expect(screen.getByText(/editing results/i)).toBeInTheDocument();
  expect(screen.queryByText(/why edit/i)).not.toBeVisible();

  const user = userEvent.setup();
  await user.click(screen.getByText(/editing guide/i));

  expect(screen.queryByText(/why edit/i)).toBeVisible();
});
