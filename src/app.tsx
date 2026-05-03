import {
  createDashboardDataStore,
  type DashboardSnapshot,
} from "@/features/dashboard-persistence/dashboard-data";
import { ProviderSearchInput } from "@/features/provider-search/components/search-input";

type FlowBoard = DashboardSnapshot["flowBoard"];
type Routine = DashboardSnapshot["routines"][number];
type Shortcut = DashboardSnapshot["shortcuts"][number];
type Weather = DashboardSnapshot["weather"];

export const App = () => {
  const dashboardData = createDashboardDataStore();
  const snapshot = dashboardData.getSnapshot();

  return <HomeboardDashboard snapshot={snapshot} />;
};

const HomeboardDashboard = ({ snapshot }: { snapshot: DashboardSnapshot }) => (
  <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col gap-6">
      <HeroHeader weather={snapshot.weather} />
      <SearchAndShortcuts shortcuts={snapshot.shortcuts} />
      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <DailyRoutinesCard routines={snapshot.routines} />
        <FlowBoardCard flowBoard={snapshot.flowBoard} />
      </div>
      <UtilityDock />
    </div>
  </main>
);

const HeroHeader = ({ weather }: { weather: Weather }) => {
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  return (
    <header className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
      <div className="space-y-3">
        <p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.32em]">
          Focus mode
        </p>
        <div className="space-y-2">
          <p className="font-heading font-semibold text-5xl tracking-tight sm:text-7xl">
            {formattedTime}
          </p>
          <h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-5xl">
            Homeboard
          </h1>
        </div>
      </div>

      <WeatherWidget weather={weather} />
    </header>
  );
};

const WeatherWidget = ({ weather }: { weather: Weather }) => (
  <section
    aria-label="Weather"
    className="rounded-3xl border bg-card p-4 text-card-foreground shadow-xs md:min-w-64"
  >
    <p className="font-medium text-muted-foreground text-sm">Weather</p>
    <p className="mt-4 font-semibold text-3xl">{weather.temperature}</p>
    <p className="text-muted-foreground text-sm">
      {weather.condition} · {weather.city}
    </p>
  </section>
);

const SearchAndShortcuts = ({ shortcuts }: { shortcuts: Shortcut[] }) => (
  <section className="grid gap-4 rounded-3xl border bg-card p-4 shadow-xs">
    {/* biome-ignore lint/a11y/useSemanticElements: jsdom does not expose the HTML search element role in tests yet. */}
    <div aria-label="Provider search" role="search">
      <ProviderSearchInput />
    </div>

    <section aria-label="Jump In" className="space-y-3">
      <h2 className="font-semibold text-lg">Jump In</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <ShortcutLink key={shortcut.id} shortcut={shortcut} />
        ))}
      </div>
    </section>
  </section>
);

const ShortcutLink = ({ shortcut }: { shortcut: Shortcut }) => (
  <a
    className="rounded-2xl border bg-background px-4 py-3 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    href={shortcut.target}
  >
    <span aria-hidden="true" className="mr-2 text-muted-foreground">
      {shortcut.icon}
    </span>
    {shortcut.label}
  </a>
);

const DailyRoutinesCard = ({ routines }: { routines: Routine[] }) => (
  <section
    aria-label="Daily Routines"
    className="rounded-3xl border bg-card p-5 shadow-xs"
  >
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-semibold text-lg">Daily Routines</h2>
      <button className="text-muted-foreground text-sm" type="button">
        Add routine
      </button>
    </div>
    <ol className="space-y-3">
      {routines.map((routine) => (
        <RoutineItem key={routine.id} routine={routine} />
      ))}
    </ol>
  </section>
);

const RoutineItem = ({ routine }: { routine: Routine }) => (
  <li
    className="rounded-2xl border bg-background p-4 data-[active=true]:border-primary data-[completed=true]:opacity-60"
    data-active={routine.isActive}
    data-completed={routine.completed}
  >
    <p className="font-medium">{routine.title}</p>
    {routine.context ? (
      <p className="text-muted-foreground text-sm">{routine.context}</p>
    ) : null}
  </li>
);

const FlowBoardCard = ({ flowBoard }: { flowBoard: FlowBoard }) => (
  <section
    aria-label="Flow Board"
    className="rounded-3xl border bg-card p-5 shadow-xs"
  >
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-semibold text-lg">Flow Board</h2>
        <p className="text-muted-foreground text-sm">
          {flowBoard.sprint.label}
        </p>
      </div>
      <button className="text-muted-foreground text-sm" type="button">
        Add task
      </button>
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      {flowBoard.columns.map((column) => {
        const cards = flowBoard.cards.filter(
          (card) => card.status === column.status
        );

        return (
          <section
            aria-label={`${column.label} tasks`}
            className="rounded-2xl bg-muted/50 p-3"
            key={column.id}
          >
            <h3 className="mb-3 flex items-center justify-between font-medium text-sm">
              {column.label}
              <span className="rounded-full bg-background px-2 py-0.5 text-muted-foreground">
                {cards.length}
              </span>
            </h3>
            <ul className="space-y-2">
              {cards.map((card) => (
                <li
                  className="rounded-xl border bg-background p-3 text-sm"
                  key={card.id}
                >
                  <p className="font-medium">{card.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {card.category}
                  </p>
                  {typeof card.progress === "number" ? (
                    <p className="mt-2 font-medium text-xs">
                      {card.progress}% complete
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  </section>
);

const UtilityDock = () => (
  <nav
    aria-label="Utility dock"
    className="mx-auto flex w-full max-w-md justify-center gap-2 rounded-full border bg-card/90 p-2 shadow-xs backdrop-blur"
  >
    {utilityDockActions.map((action) => (
      <button
        className="rounded-full px-4 py-2 text-muted-foreground text-sm hover:bg-accent hover:text-accent-foreground"
        key={action}
        type="button"
      >
        {action}
      </button>
    ))}
  </nav>
);

const utilityDockActions = ["Calendar", "Notes", "Settings"] as const;
