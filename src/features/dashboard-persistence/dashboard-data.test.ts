import { describe, expect, it } from "vitest";
import { createDashboardDataStore } from "./dashboard-data";

describe("dashboard data persistence", () => {
  it("seeds dashboard defaults for a fresh browser", () => {
    const storage = new MapStorage();

    const dashboardData = createDashboardDataStore({ storage });
    const snapshot = dashboardData.getSnapshot();

    expect(snapshot.providerPreference.selectedProvider).toBe("google");
    expect(snapshot.shortcuts.map((shortcut) => shortcut.label)).toEqual([
      "Figma",
      "GitHub",
      "Behance",
      "Discord",
    ]);
    expect(snapshot.routines).toHaveLength(4);
    expect(snapshot.flowBoard.columns.map((column) => column.status)).toEqual([
      "backlog",
      "in-progress",
      "done",
    ]);
    expect(snapshot.flowBoard.sprint.label).toBe("Sprint #42");
    expect(snapshot.weather.city).toBe("San Francisco");
  });

  it("persists selected provider across dashboard data reinitialization", async () => {
    const storage = new MapStorage();
    const dashboardData = createDashboardDataStore({ storage });

    await dashboardData.setSelectedProvider("youtube");

    const reinitializedDashboardData = createDashboardDataStore({ storage });

    expect(
      reinitializedDashboardData.getSnapshot().providerPreference
        .selectedProvider
    ).toBe("youtube");
  });

  it("persists added shortcuts across dashboard data reinitialization", async () => {
    const storage = new MapStorage();
    const dashboardData = createDashboardDataStore({ storage });

    await dashboardData.addShortcut({
      icon: "book-open",
      id: "shortcut-docs",
      label: "Docs",
      order: 4,
      target: "https://docs.example.com",
    });

    const reinitializedDashboardData = createDashboardDataStore({ storage });

    expect(
      reinitializedDashboardData
        .getSnapshot()
        .shortcuts.map((shortcut) => shortcut.label)
    ).toEqual(["Figma", "GitHub", "Behance", "Discord", "Docs"]);
  });

  it("persists routine completion without wiping other dashboard data", async () => {
    const storage = new MapStorage();
    const dashboardData = createDashboardDataStore({ storage });

    await dashboardData.setSelectedProvider("youtube");
    await dashboardData.setRoutineCompleted("routine-inbox-zero", true);

    const reinitializedDashboardData = createDashboardDataStore({ storage });
    const snapshot = reinitializedDashboardData.getSnapshot();

    expect(snapshot.providerPreference.selectedProvider).toBe("youtube");
    expect(snapshot.shortcuts.map((shortcut) => shortcut.label)).toEqual([
      "Figma",
      "GitHub",
      "Behance",
      "Discord",
    ]);
    expect(
      snapshot.routines.find((routine) => routine.id === "routine-inbox-zero")
        ?.completed
    ).toBe(true);
  });
});

class MapStorage implements Storage {
  private readonly items = new Map<string, string>();

  get length() {
    return this.items.size;
  }

  clear() {
    this.items.clear();
  }

  getItem(key: string) {
    return this.items.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.items.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.items.delete(key);
  }

  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}
