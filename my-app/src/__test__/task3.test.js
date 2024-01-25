import { render, waitFor } from "@testing-library/react";
import Header from "../components/Header";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

jest.mock("@mui/material/AppBar", () => (props) => (
  <div data-testid="AppBar">{props.children}</div>
));

test("App has a material-UI button", async () => {
  let { getAllByRole, getByTestId } = render(
    <React.Suspense fallback="loading">
      <MemoryRouter initialEntries={["/"]}>
        <I18nextProvider i18n={i18n}>
          <Header />
        </I18nextProvider>
      </MemoryRouter>
    </React.Suspense>
  );
  await waitFor(
    () => {
      getByTestId("AppBar");
    },
    { timeout: 6000 }
  );
  expect(getByTestId("AppBar")).toBeInTheDocument();
  const links = getAllByRole("link");
  expect(
    links.find((link) => link.getAttribute("href") === "/about")
  ).toBeInTheDocument();
  expect(
    links.find((link) => link.getAttribute("href") === "/")
  ).toBeInTheDocument();
});
