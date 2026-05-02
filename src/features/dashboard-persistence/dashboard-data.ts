import {
  createCollection,
  localStorageCollectionOptions,
  type StorageApi,
} from "@tanstack/react-db";

export interface ProviderPreference {
  id: "selected-provider";
  selectedProvider: "google" | "youtube";
}

export interface DashboardShortcut {
  icon: string;
  id: string;
  label: string;
  order: number;
  target: string;
}

export interface DashboardRoutine {
  completed: boolean;
  context?: string;
  id: string;
  isActive: boolean;
  order: number;
  title: string;
}

export interface FlowBoardColumn {
  id: "backlog" | "in-progress" | "done";
  label: string;
  order: number;
  status: "backlog" | "in-progress" | "done";
}

export interface FlowBoardCard {
  activityCount?: number;
  assigneeInitials?: string;
  category: string;
  completedAt?: string;
  id: string;
  order: number;
  priority?: "high" | "normal";
  progress?: number;
  status: "backlog" | "in-progress" | "done";
  title: string;
}

export interface FlowBoardSprint {
  id: "active-sprint";
  label: string;
}

export interface WeatherSettings {
  city: string;
  condition: string;
  id: "weather";
  temperature: string;
}

export interface DashboardSnapshot {
  flowBoard: {
    cards: FlowBoardCard[];
    columns: FlowBoardColumn[];
    sprint: FlowBoardSprint;
  };
  providerPreference: ProviderPreference;
  routines: DashboardRoutine[];
  shortcuts: DashboardShortcut[];
  weather: WeatherSettings;
}

interface DashboardDataStoreOptions {
  storage?: StorageApi;
  storagePrefix?: string;
}

interface PersistedTransaction {
  isPersisted: {
    promise: Promise<unknown>;
  };
}

interface DashboardCollection<
  TItem extends object,
  TKey extends string | number,
> {
  get: (key: TKey) => TItem | undefined;
  insert: (items: TItem | TItem[]) => unknown;
  startSyncImmediate: () => void;
  readonly state: Map<TKey, TItem>;
  update: (key: TKey, callback: (draft: TItem) => void) => PersistedTransaction;
}

const defaultProviderPreference = {
  id: "selected-provider",
  selectedProvider: "google",
} as const satisfies ProviderPreference;

const defaultShortcuts = [
  {
    icon: "command",
    id: "shortcut-figma",
    label: "Figma",
    order: 0,
    target: "https://figma.com",
  },
  {
    icon: "github",
    id: "shortcut-github",
    label: "GitHub",
    order: 1,
    target: "https://github.com",
  },
  {
    icon: "behance",
    id: "shortcut-behance",
    label: "Behance",
    order: 2,
    target: "https://behance.net",
  },
  {
    icon: "discord",
    id: "shortcut-discord",
    label: "Discord",
    order: 3,
    target: "https://discord.com/app",
  },
] as const satisfies DashboardShortcut[];

const defaultRoutines = [
  {
    completed: false,
    context: "Datadog & Vercel Dashboard",
    id: "routine-review-logs",
    isActive: true,
    order: 0,
    title: "Review overnight logs & metrics",
  },
  {
    completed: false,
    id: "routine-inbox-zero",
    isActive: false,
    order: 1,
    title: "Inbox zero (30 min block)",
  },
  {
    completed: false,
    id: "routine-read-chapter",
    isActive: false,
    order: 2,
    title: "Read 1 chapter (Design Systems)",
  },
  {
    completed: true,
    id: "routine-drink-water",
    isActive: false,
    order: 3,
    title: "Drink 500ml Water",
  },
] as const satisfies DashboardRoutine[];

const defaultFlowBoardColumns = [
  { id: "backlog", label: "Backlog", order: 0, status: "backlog" },
  { id: "in-progress", label: "In Progress", order: 1, status: "in-progress" },
  { id: "done", label: "Done", order: 2, status: "done" },
] as const satisfies FlowBoardColumn[];

const defaultFlowBoardCards = [
  {
    activityCount: 2,
    assigneeInitials: "J",
    category: "Design",
    id: "card-checkout-flow",
    order: 0,
    status: "backlog",
    title: "Wireframe new checkout flow",
  },
  {
    assigneeInitials: "JD",
    category: "Engineering",
    id: "card-edge-functions",
    order: 1,
    status: "backlog",
    title: "Migrate API to Edge Functions",
  },
  {
    category: "Product",
    id: "card-q3-roadmap",
    order: 0,
    priority: "high",
    progress: 75,
    status: "in-progress",
    title: "Finalize Q3 Roadmap & OKRs",
  },
  {
    category: "Team",
    completedAt: "Completed at 10:00 AM",
    id: "card-standup-sync",
    order: 0,
    status: "done",
    title: "Daily Standup Sync",
  },
  {
    category: "Engineering",
    completedAt: "Completed yesterday",
    id: "card-review-pr",
    order: 1,
    status: "done",
    title: "Review PR #842",
  },
] as const satisfies FlowBoardCard[];

const defaultFlowBoardSprint = {
  id: "active-sprint",
  label: "Sprint #42",
} as const satisfies FlowBoardSprint;

const defaultWeatherSettings = {
  city: "San Francisco",
  condition: "Clear Sky",
  id: "weather",
  temperature: "62°F",
} as const satisfies WeatherSettings;

export const createDashboardDataStore = ({
  storage,
  storagePrefix = "homeboard.dashboard",
}: DashboardDataStoreOptions = {}) => {
  const providerPreferences = makeProviderPreferenceCollection(
    `${storagePrefix}.provider-preferences`,
    storage
  );
  const shortcuts = makeShortcutCollection(
    `${storagePrefix}.shortcuts`,
    storage
  );
  const routines = makeRoutineCollection(`${storagePrefix}.routines`, storage);
  const flowBoardColumns = makeFlowBoardColumnCollection(
    `${storagePrefix}.flow-board-columns`,
    storage
  );
  const flowBoardCards = makeFlowBoardCardCollection(
    `${storagePrefix}.flow-board-cards`,
    storage
  );
  const flowBoardSprints = makeFlowBoardSprintCollection(
    `${storagePrefix}.flow-board-sprints`,
    storage
  );
  const weatherSettings = makeWeatherSettingsCollection(
    `${storagePrefix}.weather-settings`,
    storage
  );

  const collections = [
    providerPreferences,
    shortcuts,
    routines,
    flowBoardColumns,
    flowBoardCards,
    flowBoardSprints,
    weatherSettings,
  ];

  for (const collection of collections) {
    collection.startSyncImmediate();
  }

  seedCollection(providerPreferences, [defaultProviderPreference]);
  seedCollection(shortcuts, [...defaultShortcuts]);
  seedCollection(routines, [...defaultRoutines]);
  seedCollection(flowBoardColumns, [...defaultFlowBoardColumns]);
  seedCollection(flowBoardCards, [...defaultFlowBoardCards]);
  seedCollection(flowBoardSprints, [defaultFlowBoardSprint]);
  seedCollection(weatherSettings, [defaultWeatherSettings]);

  return {
    getSnapshot: (): DashboardSnapshot => ({
      flowBoard: {
        cards: sortByOrder([...flowBoardCards.state.values()]),
        columns: sortByOrder([...flowBoardColumns.state.values()]),
        sprint: getRequiredItem(flowBoardSprints, defaultFlowBoardSprint.id),
      },
      providerPreference: getRequiredItem(
        providerPreferences,
        defaultProviderPreference.id
      ),
      routines: sortByOrder([...routines.state.values()]),
      shortcuts: sortByOrder([...shortcuts.state.values()]),
      weather: getRequiredItem(weatherSettings, defaultWeatherSettings.id),
    }),
    setRoutineCompleted: async (
      routineId: DashboardRoutine["id"],
      completed: boolean
    ) => {
      if (!routines.get(routineId)) {
        throw new Error(`Expected routine '${routineId}' to exist.`);
      }

      const transaction = routines.update(routineId, (routine) => {
        routine.completed = completed;
      });

      await transaction.isPersisted.promise;
    },
    setSelectedProvider: async (
      selectedProvider: ProviderPreference["selectedProvider"]
    ) => {
      const transaction = providerPreferences.update(
        defaultProviderPreference.id,
        (preference) => {
          preference.selectedProvider = selectedProvider;
        }
      );

      await transaction.isPersisted.promise;
    },
  };
};

const seedCollection = <TItem extends object, TKey extends string | number>(
  collection: DashboardCollection<TItem, TKey>,
  items: TItem[]
) => {
  if (collection.state.size > 0) {
    return;
  }

  collection.insert(items);
};

const getRequiredItem = <TItem extends object, TKey extends string | number>(
  collection: DashboardCollection<TItem, TKey>,
  key: TKey
) => {
  const item = collection.get(key);

  if (!item) {
    throw new Error(`Expected dashboard data item '${String(key)}' to exist.`);
  }

  return item;
};

const sortByOrder = <TItem extends { order?: number }>(items: TItem[]) =>
  items.toSorted((first, second) => (first.order ?? 0) - (second.order ?? 0));

const makeProviderPreferenceCollection = (
  storageKey: string,
  storage?: StorageApi
) =>
  makeLocalStorageCollection<ProviderPreference, ProviderPreference["id"]>({
    getKey: (preference) => preference.id,
    storage,
    storageKey,
  });

const makeShortcutCollection = (storageKey: string, storage?: StorageApi) =>
  makeLocalStorageCollection<DashboardShortcut, DashboardShortcut["id"]>({
    getKey: (shortcut) => shortcut.id,
    storage,
    storageKey,
  });

const makeRoutineCollection = (storageKey: string, storage?: StorageApi) =>
  makeLocalStorageCollection<DashboardRoutine, DashboardRoutine["id"]>({
    getKey: (routine) => routine.id,
    storage,
    storageKey,
  });

const makeFlowBoardColumnCollection = (
  storageKey: string,
  storage?: StorageApi
) =>
  makeLocalStorageCollection<FlowBoardColumn, FlowBoardColumn["id"]>({
    getKey: (column) => column.id,
    storage,
    storageKey,
  });

const makeFlowBoardCardCollection = (
  storageKey: string,
  storage?: StorageApi
) =>
  makeLocalStorageCollection<FlowBoardCard, FlowBoardCard["id"]>({
    getKey: (card) => card.id,
    storage,
    storageKey,
  });

const makeFlowBoardSprintCollection = (
  storageKey: string,
  storage?: StorageApi
) =>
  makeLocalStorageCollection<FlowBoardSprint, FlowBoardSprint["id"]>({
    getKey: (sprint) => sprint.id,
    storage,
    storageKey,
  });

const makeWeatherSettingsCollection = (
  storageKey: string,
  storage?: StorageApi
) =>
  makeLocalStorageCollection<WeatherSettings, WeatherSettings["id"]>({
    getKey: (weather) => weather.id,
    storage,
    storageKey,
  });

const makeLocalStorageCollection = <
  TItem extends object,
  TKey extends string | number,
>({
  getKey,
  storage,
  storageKey,
}: {
  getKey: (item: TItem) => TKey;
  storage?: StorageApi;
  storageKey: string;
}): DashboardCollection<TItem, TKey> =>
  createCollection(
    localStorageCollectionOptions<TItem, TKey>({
      getKey,
      storage,
      storageKey,
    })
  ) as unknown as DashboardCollection<TItem, TKey>;
