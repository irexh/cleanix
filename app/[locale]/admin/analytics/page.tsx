import {getAnalyticsEventsSince} from "@/lib/web-analytics";

type AnalyticsRow = {
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
  const start30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startWeek = getStartOfWeek(now);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const events = (await getAnalyticsEventsSince(start30Days)) as AnalyticsRow[];
  const pageViews = events.filter((event) => event.eventType === "page_view");
  const buttonClicks = events.filter((event) => event.eventType === "button_click");
  const bookingStarts = events.filter((event) => event.eventType === "booking_started");
  const bookingCompleted = events.filter((event) => event.eventType === "booking_completed");

  const visitorsToday = uniqueVisitors(pageViews.filter((event) => event.createdAt >= startToday));
  const visitorsWeek = uniqueVisitors(pageViews.filter((event) => event.createdAt >= startWeek));
  const visitorsMonth = uniqueVisitors(pageViews.filter((event) => event.createdAt >= startMonth));
  const allVisitors = uniqueVisitors(pageViews);

  const averageStaySeconds = averageSessionDuration(pageViews);
  const conversionRate = bookingStarts.length > 0
    ? (bookingCompleted.length / bookingStarts.length) * 100
    : 0;

  const topButtons = topCounts(buttonClicks.map((event) => event.eventName), 6);
  const topPages = topCounts(pageViews.map((event) => humanizePath(event.path)), 6);
  const topDevices = topCounts(pageViews.map((event) => event.deviceType || "Neznano"), 3);
  const topSources = topCounts(pageViews.map((event) => event.source || "Direktno"), 6);
  const topCountries = topCounts(pageViews.map((event) => event.country || "Neznano"), 6);
  const topCities = topCounts(
    pageViews.map((event) => {
      if (event.city && event.country) return `${event.city}, ${event.country}`;
      return event.city || "Neznano mesto";
    }),
    6
  );

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
              Pregled obiska spletne strani, klikov na gumbe, najbolj gledanih strani,
              virov prometa, naprav in konverzij rezervacij.
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
          <MetricCard label="Skupaj obiskovalcev" value={String(allVisitors)} hint="Unikatni obiskovalci" />
          <MetricCard label="Obiskovalci danes" value={String(visitorsToday)} hint="Današnji obisk" />
          <MetricCard label="Obiskovalci ta teden" value={String(visitorsWeek)} hint="Tedenski obisk" />
          <MetricCard label="Obiskovalci ta mesec" value={String(visitorsMonth)} hint="Mesečni obisk" />
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Ogledi strani" value={String(pageViews.length)} hint="Skupni ogledi strani" />
          <MetricCard label="Kliki na gumbe" value={String(buttonClicks.length)} hint="Gumbi in povezave" />
          <MetricCard label="Povprečen čas" value={formatDuration(averageStaySeconds)} hint="Ocena trajanja obiska" />
          <MetricCard label="Stopnja konverzije" value={`${conversionRate.toFixed(1)}%`} hint="Zaključena / začeta naročila" />
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Najbolj obiskane strani">
            <TableList
              headerLeft="Stran"
              headerRight="Ogledi"
              rows={topPages}
              emptyText="Za zdaj še ni ogledov strani."
            />
          </Panel>

          <Panel title="Največ klikov na gumbe">
            <TableList
              headerLeft="Gumb"
              headerRight="Kliki"
              rows={topButtons}
              emptyText="Za zdaj še ni klikov."
            />
          </Panel>
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-3">
          <Panel title="Obiskovalci po napravah">
            <BarList items={topDevices} />
          </Panel>

          <Panel title="Najpogostejši viri prometa">
            <BarList items={topSources} />
          </Panel>

          <Panel title="Potek naročila">
            <TableList
              headerLeft="Korak"
              headerRight="Število"
              rows={[
                {label: "Začetek naročila", count: bookingStarts.length},
                {label: "Uspešno zaključena naročila", count: bookingCompleted.length},
                {label: "Stopnja konverzije", count: Number(conversionRate.toFixed(1)), suffix: "%"}
              ]}
              emptyText="Za zdaj še ni podatkov o naročilih."
            />
          </Panel>
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-2">
          <Panel title="Države obiskovalcev">
            <BarList items={topCountries} />
          </Panel>

          <Panel title="Mesta obiskovalcev">
            <BarList items={topCities} />
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
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-[#dbe7fb] bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-[#123b7a]">{title}</h2>
      {children}
    </section>
  );
}

function TableList({
  headerLeft,
  headerRight,
  rows,
  emptyText
}: {
  headerLeft: string;
  headerRight: string;
  rows: Array<{label: string; count: number; suffix?: string}>;
  emptyText: string;
}) {
  if (rows.length === 0) {
    return <div className="rounded-[16px] bg-[#f8fbff] px-3 py-3 text-sm text-[#5d716a]">{emptyText}</div>;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#dbe7fb]">
      <div className="grid grid-cols-[1fr_auto] bg-[#f8fbff] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        <span>{headerLeft}</span>
        <span>{headerRight}</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-[#eef4ff] px-3 py-3 text-sm"
        >
          <span className="font-medium text-[#123b7a]">{row.label}</span>
          <span className="font-bold text-[#2f6fe4]">
            {row.count}
            {row.suffix || ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function BarList({items}: {items: Array<{label: string; count: number}>}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (items.length === 0) {
    return <div className="rounded-[16px] bg-[#f8fbff] px-3 py-3 text-sm text-[#5d716a]">Za zdaj še ni podatkov.</div>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0;

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

function topCounts(values: string[], limit: number) {
  const counter = new Map<string, number>();

  for (const value of values) {
    if (!value) continue;
    counter.set(value, (counter.get(value) ?? 0) + 1);
  }

  return Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({label, count}));
}

function uniqueVisitors(rows: AnalyticsRow[]) {
  return new Set(rows.map((row) => row.visitorId)).size;
}

function averageSessionDuration(rows: AnalyticsRow[]) {
  const bySession = new Map<string, AnalyticsRow[]>();

  for (const row of rows) {
    const current = bySession.get(row.sessionId) ?? [];
    current.push(row);
    bySession.set(row.sessionId, current);
  }

  const durations: number[] = [];

  for (const sessionRows of bySession.values()) {
    const sorted = [...sessionRows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (sorted.length < 2) continue;

    const seconds = Math.round(
      (sorted[sorted.length - 1].createdAt.getTime() - sorted[0].createdAt.getTime()) / 1000
    );

    durations.push(Math.max(seconds, 0));
  }

  if (durations.length === 0) return 0;

  return Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length);
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function getStartOfWeek(date: Date) {
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = value.getDay();
  const diff = day === 0 ? 6 : day - 1;
  value.setDate(value.getDate() - diff);
  return value;
}

function humanizePath(path: string) {
  if (path === "/" || path === "/sl") return "Domov";
  if (path.includes("/booking")) return "Naročilo čiščenja";
  if (path.includes("/business")) return "Cleanix Business";
  if (path.includes("/contact")) return "Kontakt";
  if (path.includes("/about")) return "O nas";
  if (path.includes("/success")) return "Uspešno naročilo";

  return path.replace("/sl/", "").replaceAll("-", " ");
}
