// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProviderSearchInput } from "./search-input";

const searchQueryName = /search query/i;

afterEach(() => {
  cleanup();
});

describe("ProviderSearchInput", () => {
  it("submits normal queries through the selected provider", () => {
    const navigate = vi.fn();

    render(
      <ProviderSearchInput onNavigate={navigate} selectedProvider="youtube" />
    );

    const searchInput = screen.getByRole("textbox", { name: searchQueryName });

    fireEvent.change(searchInput, { target: { value: "daily planning" } });
    fireEvent.keyDown(searchInput, { code: "Enter", key: "Enter" });

    expect(navigate).toHaveBeenCalledWith(
      "https://www.youtube.com/results?search_query=daily%20planning"
    );
  });

  it("treats URL-like input as direct navigation", () => {
    const navigate = vi.fn();

    render(
      <ProviderSearchInput onNavigate={navigate} selectedProvider="google" />
    );

    const searchInput = screen.getByRole("textbox", { name: searchQueryName });

    fireEvent.change(searchInput, { target: { value: "example.com/docs" } });
    fireEvent.submit(searchInput);

    expect(navigate).toHaveBeenCalledWith("https://example.com/docs");
  });
});
