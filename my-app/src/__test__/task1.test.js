import React from "react";
import App from "../App";
import Header from "../components/Header";
import MyContainer from "../components/MyContainer";
import About from "../components/About";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    BrowserRouter: ({ children }) => <div> {children} </div>,
  };
});

jest.mock("../components/Header");
jest.mock("../components/MyContainer");
jest.mock("../components/About");

test("Should render page header and HomePage on default route", () => {
  Header.mockImplementation(() => (
    <div data-testid="pg-header">PageHeaderMock</div>
  ));
  MyContainer.mockImplementation(() => (
    <div data-testid="pg-container">MyContainerMock</div>
  ));
  About.mockImplementation(() => (
    <div data-testid="pg-about">AboutPageMock</div>
  ));

  let { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId("pg-header")).toBeInTheDocument();
  expect(getByTestId("pg-container")).toBeInTheDocument();
  expect(queryByTestId("pg-about")).not.toBeInTheDocument();
});

test("Should render page header and Aboutpage in /about -route", () => {
  Header.mockImplementation(() => (
    <div data-testid="pg-header">PageHeaderMock</div>
  ));
  MyContainer.mockImplementation(() => (
    <div data-testid="pg-container">MyContainerMock</div>
  ));
  About.mockImplementation(() => (
    <div data-testid="pg-about">AboutPageMock</div>
  ));

  let { queryByTestId, getByTestId } = render(
    <MemoryRouter initialEntries={["/about"]}>
      <App />
    </MemoryRouter>
  );

  expect(getByTestId("pg-header")).toBeInTheDocument();
  expect(getByTestId("pg-about")).toBeInTheDocument();
  expect(queryByTestId("pg-container")).not.toBeInTheDocument();
});
