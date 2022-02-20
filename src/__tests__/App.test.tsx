import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import App from "../App";

it("renders without crashing", () => {
  const { container } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(container).toMatchSnapshot(); /* This is our snapshot */
});
