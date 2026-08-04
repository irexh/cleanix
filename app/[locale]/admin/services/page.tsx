const services = [
  {
    title: "Redno čiščenje",
    status: "Aktivno",
    text: "Vzdrževalno čiščenje doma na tedenski, 14-dnevni ali mesečni osnovi."
  },
  {
    title: "Generalno čiščenje",
    status: "Aktivno",
    text: "Temeljitejše čiščenje za domove, ki potrebujejo dodatno osvežitev."
  },
  {
    title: "Pomoč v gospodinjstvu",
    status: "Kmalu",
    text: "Storitev je pripravljena za kasnejšo aktivacijo."
  },
  {
    title: "Cleanix Biznis",
    status: "Aktivno",
    text: "Čiščenje poslovnih prostorov, pisarn, salonov in drugih objektov."
  }
];

export default function AdminServicesPage() {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Services
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Pregled storitev. V naslednjem koraku bomo tukaj dodali urejanje cen,
          popustov in aktivno/skrito stanje.
        </p>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-[28px] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-extrabold">{service.title}</h2>
                <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-extrabold text-[#123b7a]">
                  {service.status}
                </span>
              </div>
              <p className="leading-7 text-[#5d716a]">{service.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
