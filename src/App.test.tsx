import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { App } from "./App";
import * as ddSdk from "./datadog/ShallowObjectEqualityChecker";

describe("App.tsx", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  // This is our target test proving the use case for the change to areObjectShallowEqual
  it("fails to render due to React.memo override", async () => {
    const overrideMemoRender = async () => {
      await waitFor(() => render(<App />));
    };
    await expect(overrideMemoRender).rejects.toThrow(TypeError);
    // This is the error being thrown by areObjectShallowEqual when the memoized props are null due to being suspended
    await expect(overrideMemoRender).rejects.toThrow(
      "Cannot convert undefined or null to object"
    );
  });
  it("renders without the React.memo override", async () => {
    // When we bypass the areObjectShallowEqual entirely and always return false, this should just treat the component as if it is not memoized at all
    jest.spyOn(ddSdk, "areObjectShallowEqual").mockImplementation(() => false);
    await waitFor(() => render(<App />));
    expect(screen.findByText("Async is true")).toBeTruthy();
  });
});
