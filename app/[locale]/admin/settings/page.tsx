const settings = [
  {label: "E-pošta", value: "info@cleanix.si"},
  {label: "Admin prijava", value: "admin@cleanix.si"},
  {label: "Območje", value: "Ljubljana"},
  {label: "Online plačilo", value: "Skrito / pripravljeno za kasneje"},
  {label: "Jezik", value: "Slovenščina"},
  {label: "Glavni fokus", value: "Cleanix Biznis"}
];

export default function AdminSettingsPage() {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Settings
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Osnovne nastavitve sistema. Kasneje jih povežemo z obrazci za urejanje.
        </p>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {settings.map((setting) => (
            <article key={setting.label} className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                {setting.label}
              </p>
              <p className="mt-3 text-xl font-extrabold">{setting.value}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
