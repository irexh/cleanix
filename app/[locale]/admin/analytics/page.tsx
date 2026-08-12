import {getAnalyticsEvents} from "@/lib/web-analytics";

type AnalyticsEvent = {
  visitorId: string;
  sessionId: string;
  path: string;
  eventType: string;
  eventName: string;
  source?: string | null;
  deviceType?: string | null;
  country?: string | null;
  city?: string | null;
  createdAt: Date;
};

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const events = (await getAnalyticsEvents(thirtyDaysAgo)) as AnalyticsEvent[];

  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const pageViews = events.filter((event) => event.eventType === "page_view");
  const clicks = events.filter((event) => event.eventType === "button_click");
  const bookingStarts = events.filter((event) => event.eventType === "booking_started");
  const bookingCompleted = events.filter((event) => event.eventType === "booking_completed");

  const visitorsToday = uniqueCount(pageViews.filter((event) => event.createdAt >= todayStart), "visitorId");
  const visitorsWeek = uniqueCount(pageViews.filter((event) => event.createdAt >= weekStart), "visitorId");
  const visitorsMonth = uniqueCount(pageViews.filter((event) => event.createdAt >= monthStart), "visitorId");
  const totalVisitors = uniqueCount(pageViews, "visitorId");

  const topButtons = topEntries(clicks.map((event) => event.eventName), 5);
  const topPages = topEntries(pageViews.map((event) => normalizePath(event.path)), 5);
  const topSources = topEntries(pageViews.map((event) => event.source || "Direktno"), 6);
  const topDevices = topEntries(pageViews.map((event) => event.deviceType || "Neznano"), 3);
  const topCountries = topEntries(pageViews.map((event) => event.country || "Neznano"), 5);
  const topCities = topEntries(
    pageViews.map((event) => {
      if (event.city && event.country) return `${event.city}, ${event.country}`;
      return event.city || "Neznano mesto";
    }),
    5
  );

  const averageSeconds = calculateAverageTimeOnSite(pageViews);
  const conversionRate = bookingStarts.length
    ? (bookingCompleted.length / bookingStarts.length) * 100
    : 0;

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-4 py-4 text-[#123b7a] sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX ANALITIKA
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Spletna analitika
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-[#5d716a]">
              Pregled obiskovalcev, klikov, najbolj gledanih strani, naprav, virov prometa
              in uspešnosti naročil za spletno stran Cleanix.
            </p>
          </div>

          <div className="rounded-[18px] border border-[#dbe7fb] bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
              Obdobje
            </p>
            <p className="mt-1 text-sm font-bold text-[#123b7a]">Zadnjih 30 dni</p>
          </div>
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Skupaj obiskovalcev" value={String(totalVisitors)} hint="Unikatni obiskovalci" />
          <MetricCard label="Danes" value={String(visitorsToday)} hint="Obiskovalci danes" />
          <MetricCard label="Ta teden" value={String(visitorsWeek)} hint="Obiskovalci ta teden" />
          <MetricCard label="Ta mesec" value={String(visitorsMonth)} hint="Obiskovalci ta mesec" />
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Ogledi strani" value={String(pageViews.length)} hint="Skupni ogledi" />
          <MetricCard label="Skupaj kliki" value={String(clicks.length)} hint="Kliki na gumbe in povezave" />
          <MetricCard label="Povprečen čas" value={formatDuration(averageSeconds)} hint="Ocena na sejo" />
          <MetricCard label="Stopnja konverzije" value={`${conversionRate.toFixed(1)}%`} hint="Zaključena naročila / začeta naročila" />
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Najbolj obiskane strani" badge={`${topPages.reduce((sum, item) => sum + item.count, 0)}`}>
            <StatsTable
              headers={["Stran", "Ogledi"]}
              rows={topPages.map((item) => [item.label, String(item.count)])}
              emptyText="Zaenkrat še ni ogledov strani."
            />
          </Panel>

          <Panel title="Največ klikov na gumbe" badge={`${clicks.length}`}>
            <StatsTable
              headers={["Gumb", "Kliki"]}
              rows={topButtons.map((item) => [item.label, String(item.count)])}
              emptyText="Zaenkrat še ni klikov."
            />
          </Panel>
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-3">
          <Panel title="Obiskovalci po napravah">
            <StackedList items={topDevices} />
          </Panel>

          <Panel title="Najpogostejši viri prometa">
            <StackedList items={topSources} />
          </Panel>

          <Panel title="Funnel naročila">
            <StatsTable
              headers={["Korak", "Število"]}
              rows={[
                ["Začetek naročila", String(bookingStarts.length)],
                ["Uspešno zaključena naročila", String(bookingCompleted.length)],
                ["Konverzija", `${conversionRate.toFixed(1)}%`]
              ]}
              emptyText="Zaenkrat še ni podatkov o naročilih."
            />
          </Panel>
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-2">
          <Panel title="Države obiskovalcev">
            <StackedList items={topCountries} />
          </Panel>

          <Panel title="Mesta obiskovalcev">
            <StackedList items={topCities} />
          </Panel>
        </section>
      </div>
    </main>
  );
}

function MetricCard({label, value, hint}: {label: string; value: string; hint: string}) {
  return (
    <div className="rounded-[20px] border border-[#dbe7fb] bg-white px-4 py-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5d716a]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#123b7a]">{value}</p>
      <p className="mt-2 text-xs text-[#5d716a]">{hint}</p>
    </div>
  );
}

function Panel({
  title,
  children,
  badge
}: {
  title: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <section className="rounded-[22px] border border-[#dbe7fb] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#123b7a]">{title}</h2>
        {badge ? (
          <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-[10px] font-bold text-[#2f6fe4]">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function StatsTable({
  headers,
  rows,
  emptyText
}: {
  headers: [string, string];
  rows: string[][];
  emptyText: string;
}) {
  if (rows.length === 0) {
    return <div className="rounded-[16px] bg-[#f8fbff] px-3 py-3 text-sm text-[#5d716a]">{emptyText}</div>;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#dbe7fb]">
      <div className="grid grid-cols-[1fr_auto] bg-[#f8fbff] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        <span>{headers[0]}</span>
        <span>{headers[1]}</span>
      </div>
      {rows.map((row) => (
        <div
          key={`${row[0]}-${row[1]}`}
          className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-[#eef4ff] px-3 py-3 text-sm"
        >
          <span className="font-medium text-[#123b7a]">{row[0]}</span>
          <span className="font-bold text-[#2f6fe4]">{row[1]}</span>
        </div>
      ))}
    </div>
  );
}

function StackedList({items}: {items: {label: string; count: number}[]}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (items.length === 0) {
    return <div className="rounded-[16px] bg-[#f8fbff] px-3 py-3 text-sm text-[#5d716a]">Zaenkrat še ni podatkov.</div>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const percentage = total ? (item.count / total) * 100 : 0;

        return (
          <div key={item.label} className="rounded-[16px] bg-[#f8fbff] px-3 py-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-[#123b7a]">{item.label}</span>
              <span className="font-bold text-[#2f6fe4]">
                {item.count} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#dbe7fb]">
              <div
                className="h-2 rounded-full bg-[#2f6fe4]"
                style={{width: `${Math.max(percentage, 4)}%`}}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function topEntries(values: string[], limit: number) {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({label, count}));
}

function uniqueCount<T, K extends keyof T>(items: T[], key: K) {
  return new Set(items.map((item) => String(item[key]))).size;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const copy = startOfDay(date);
  const day = copy.getDay();
  const shift = day === 0 ? 6 : day - 1;
  copy.setDate(copy.getDate() - shift);
  return copy;
}

function normalizePath(path: string) {
  if (path === "/sl" || path === "/") return "Domov";
  if (path.includes("/booking")) return "Naročilo";
  if (path.includes("/business")) return "Cleanix Business";
  if (path.includes("/contact")) return "Kontakt";
  if (path.includes("/about")) return "O nas";
  if (path.includes("/success")) return "Uspešno naročilo";
  return path.replace("/sl/", "").replaceAll("-", " ");
}

function calculateAverageTimeOnSite(events: AnalyticsEvent[]) {
  const sessionMap = new Map<string, AnalyticsEvent[]>();

  for (const event of events) {
    const current = sessionMap.get(event.sessionId) ?? [];
    current.push(event);
    sessionMap.set(event.sessionId, current);
  }

  const durations: number[] = [];

  for (const sessionEvents of sessionMap.values()) {
    const sorted = [...sessionEvents].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (sorted.length < 2) continue;

    const durationSeconds = Math.max(
      0,
      Math.round((sorted[sorted.length - 1].createdAt.getTime() - sorted[0].createdAt.getTime()) / 1000)
    );

    durations.push(durationSeconds);
  }

  if (durations.length === 0) return 0;

  return Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length);
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}
