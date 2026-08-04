const contentBlocks = [
  {
    title: "Homepage hero",
    text: "Več časa za lepe stvari."
  },
  {
    title: "Cleanix Biznis",
    text: "Profesionalno čiščenje za poslovne prostore."
  },
  {
    title: "Storitve",
    text: "Redno čiščenje, generalno čiščenje in poslovni prostori."
  },
  {
    title: "Kontakt",
    text: "Telefon, e-pošta in povpraševanja."
  }
];

export default function AdminContentPage() {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Content
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Pregled glavnih tekstov. V naslednji fazi dodamo urejanje brez VS Code.
        </p>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {contentBlocks.map((block) => (
            <article key={block.title} className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#4d8dff]">
                Sekcija
              </p>
              <h2 className="text-2xl font-extrabold">{block.title}</h2>
              <p className="mt-3 leading-7 text-[#5d716a]">{block.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
