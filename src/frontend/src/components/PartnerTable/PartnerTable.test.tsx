import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderer from "react-test-renderer";

import PartnerTable from ".";

test("PartnerTable renders correctly on initial display", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <PartnerTable />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

const partners = [
  {
    details: [],
    name: "Portland Community College",
    area: "",
    instructions: "",
    contacts: ["Leni Tupper"],
    website: "",
  },
  {
    details: [],
    name: "Criminals Anonymous",
    area: "",
    instructions: "",
    contacts: ["hrcubbedge1776@gmail.com"],
    website: "",
  },
];

test("PartnerTable only shows the details of one partner at a time", async () => {
  const user = userEvent.setup();

  render(<PartnerTable partners={partners} />, {
    wrapper: BrowserRouter,
  });

  expect(screen.queryByText(/portland community college/i)).toBeVisible();
  expect(screen.queryByText(/criminals anonymous/i)).toBeVisible();
  expect(screen.queryByText(/leni/i)).not.toBeVisible();
  expect(screen.queryByText(/hrcubbedge1776/i)).not.toBeVisible();

  await user.click(screen.getByText(/portland community/i));
  expect(screen.queryByText(/leni/i)).toBeVisible();
  expect(screen.queryByText(/hrcubbedge1776/i)).not.toBeVisible();

  await user.click(screen.getByText(/criminals anonymou/i));
  expect(screen.queryByText(/leni/i)).not.toBeVisible();
  expect(screen.queryByText(/hrcubbedge1776/i)).toBeVisible();
});
