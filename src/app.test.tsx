// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./app";
import { createDashboardDataStore } from "./features/dashboard-persistence/dashboard-data";

const homeboardName = /homeboard/i;
const focusModeText = /focus mode/i;
const weatherName = /weather/i;
const providerSearchName = /provider search/i;
const jumpInName = /jump in/i;
const dailyRoutinesName = /daily routines/i;
const flowBoardName = /flow board/i;
const utilityDockName = /utility dock/i;
const sanFranciscoText = /san francisco/i;
const clearSkyText = /clear sky/i;
const figmaName = /figma/i;
const addShortcutName = /add shortcut/i;
const createShortcutName = /create shortcut/i;
const docsName = /docs/i;
const labelName = /shortcut label/i;
const targetName = /shortcut target/i;
const reviewLogsText = /review overnight logs & metrics/i;
const finalizeRoadmapText = /finalize q3 roadmap & okrs/i;
const sprintMarkerText = /sprint #42/i;
const progressText = /75%/;
const searchQueryName = /search query/i;
const searchYoutubePlaceholder = /search youtube/i;
const youtubeName = /youtube/i;

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Homeboard dashboard", () => {
  it("renders the primary dashboard regions", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: homeboardName })).toBeTruthy();
    expect(screen.getByText(focusModeText)).toBeTruthy();
    expect(screen.getByRole("region", { name: weatherName })).toBeTruthy();
    expect(
      screen.getByRole("search", { name: providerSearchName })
    ).toBeTruthy();
    expect(screen.getByRole("region", { name: jumpInName })).toBeTruthy();
    expect(
      screen.getByRole("region", { name: dailyRoutinesName })
    ).toBeTruthy();
    expect(screen.getByRole("region", { name: flowBoardName })).toBeTruthy();
    expect(
      screen.getByRole("navigation", { name: utilityDockName })
    ).toBeTruthy();
  });

  it("shows seeded dashboard data in the shell", () => {
    render(<App />);

    expect(screen.getByText(sanFranciscoText)).toBeTruthy();
    expect(screen.getByText(clearSkyText)).toBeTruthy();
    expect(screen.getByRole("link", { name: figmaName })).toBeTruthy();
    expect(screen.getByText(reviewLogsText)).toBeTruthy();
    expect(screen.getByText(sprintMarkerText)).toBeTruthy();
    expect(screen.getByText(finalizeRoadmapText)).toBeTruthy();
    expect(screen.getByText(progressText)).toBeTruthy();
  });

  it("offers a keyboard-reachable way to add a Jump In shortcut", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: addShortcutName })).toBeTruthy();
  });

  it("renders persisted Jump In shortcuts in configured order", () => {
    const dashboardData = createDashboardDataStore();

    dashboardData.addShortcut({
      icon: "book-open",
      id: "shortcut-docs",
      label: "Docs",
      order: -1,
      target: "https://docs.example.com",
    });

    render(<App />);

    const jumpInRegion = screen.getByRole("region", { name: jumpInName });
    const shortcutLinks = within(jumpInRegion).getAllByRole("link");

    expect(shortcutLinks.map((link) => link.getAttribute("href"))).toEqual([
      "https://docs.example.com",
      "https://figma.com",
      "https://github.com",
      "https://behance.net",
      "https://discord.com/app",
    ]);
    expect(
      screen.getByRole("link", { name: docsName }).getAttribute("href")
    ).toBe("https://docs.example.com");
  });

  it("creates a persisted Jump In shortcut from the dashboard", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: addShortcutName }));
    fireEvent.change(screen.getByRole("textbox", { name: labelName }), {
      target: { value: "Docs" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: targetName }), {
      target: { value: "https://docs.example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: createShortcutName }));

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: docsName }).getAttribute("href")
      ).toBe("https://docs.example.com");
    });
    expect(screen.getByRole("link", { name: docsName }).textContent).not.toBe(
      "linkDocs"
    );

    const reinitializedDashboardData = createDashboardDataStore();

    expect(
      reinitializedDashboardData
        .getSnapshot()
        .shortcuts.some((shortcut) => shortcut.label === "Docs")
    ).toBe(true);
  });

  it("keeps provider search usable inside the dashboard", () => {
    render(<App />);

    const searchInput = screen.getByRole("textbox", { name: searchQueryName });

    fireEvent.change(searchInput, { target: { value: "daily planning" } });

    expect(searchInput).toHaveProperty("value", "daily planning");
  });

  it("starts provider search from the persisted provider preference", async () => {
    const dashboardData = createDashboardDataStore();

    await dashboardData.setSelectedProvider("youtube");

    render(<App />);

    expect(screen.getByPlaceholderText(searchYoutubePlaceholder)).toBeTruthy();
  });

  it("saves provider changes to dashboard persistence", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByRole("option", { name: youtubeName }));

    const reinitializedDashboardData = createDashboardDataStore();

    await waitFor(() => {
      expect(
        reinitializedDashboardData.getSnapshot().providerPreference
          .selectedProvider
      ).toBe("youtube");
    });
  });
});
