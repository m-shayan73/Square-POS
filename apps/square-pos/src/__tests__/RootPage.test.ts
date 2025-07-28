import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import RootPage from "../app/page";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");

describe("RootPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders spinner when session is loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "loading",
    });
    render(React.createElement(RootPage));
    expect(screen.getByTestId("center-spinner")).toBeInTheDocument();
  });

  it("renders Login component when not loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    render(React.createElement(RootPage));
    expect(screen.getByTestId("login-root")).toBeInTheDocument();
  });
});
