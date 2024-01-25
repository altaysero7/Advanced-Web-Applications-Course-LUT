import React from "react";
import { render } from "@testing-library/react";
import MyHOC from "../components/MyHOC";
import "@testing-library/jest-dom/extend-expect";

test("Wraps element with a div that has class 'wrapper'", async () => {
  const Component = ({ name }) => {
    return <div data-testid="component"> Hello {name}!</div>;
  };

  const wrappedWithName = MyHOC(Component, { name: "Kalle" });

  const { getByText, getByTestId } = render(wrappedWithName);

  expect(getByText(/Hello Kalle!/i)).toBeInTheDocument();
  expect(getByTestId("component").parentElement).toHaveClass("wrapper");
});

test("Should also wrap with a div that has class 'wrapper'", async () => {
  const Component = ({ name }) => (
    <p data-testid="component2"> My name is {name}!</p>
  );
  const wrappedWithName = MyHOC(Component, { name: "Mikko" });
  const { getByText, getByTestId } = render(wrappedWithName);
  expect(getByText(/My name is Mikko!/i)).toBeInTheDocument();
  expect(getByTestId("component2").parentElement).toHaveClass("wrapper");
});
