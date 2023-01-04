import { BrowserRouter } from "react-router-dom";

import renderer from "react-test-renderer";
import OeciLogin from ".";

it("OeciLogin renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <OeciLogin
          userId=""
          password=""
          missingUserId={false}
          missingPassword={false}
          expectedFailure={false}
          expectedFailureMessage=""
          invalidResponse={false}
          missingInputs={false}
        />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
