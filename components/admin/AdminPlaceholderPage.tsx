type AdminPlaceholderPageProps = {
  title: string;
  description: string;
  items: string[];
};

export default function AdminPlaceholderPage({
  title,
  description,
  items
}: AdminPlaceholderPageProps) {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          {description}
        </p>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">Kaj bomo tukaj upravljali?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#dbe7fb] bg-[#f6f9ff] p-5 text-sm font-semibold leading-6 text-[#123b7a]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
