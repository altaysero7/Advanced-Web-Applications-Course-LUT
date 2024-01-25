import React from "react";
import About from "../components/About";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    BrowserRouter: ({ children }) => <div> {children} </div>,
  };
});

test("About page uses useEffect", async () => {
  let query = jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, title: "title 1" },
          { id: 2, title: "title 2" },
        ]),
    })
  );
  await act(async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <About />
      </I18nextProvider>
    );
  });
  expect(query).toHaveBeenCalled();
  await waitFor(() => {
    expect(screen.getByText("title 1")).toBeInTheDocument();
    expect(screen.getByText("title 2")).toBeInTheDocument();
  });
});
