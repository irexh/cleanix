export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f9ff] px-6 py-16 text-[#123b7a]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">
            <span /> KONTAKT
          </p>
          <h1 className="mb-5 text-5xl font-bold">Stopite v stik z nami.</h1>
          <p className="text-lg leading-8 text-[#5d716a]">
            Imate vprašanje, posebno željo ali želite pomoč pri rezervaciji?
            Pišite nam ali nas pokličite in z veseljem vam pomagamo.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
            <h2 className="mb-6 text-2xl font-bold">Kontaktni podatki</h2>

            <div className="grid gap-5">
              <div className="rounded-2xl bg-[#eaf2ff] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                  Telefon
                </p>
                <a
                  href="tel:069665229"
                  className="text-xl font-bold text-[#123b7a] hover:text-[#2f6fe4]"
                >
                  069 665 229
                </a>
              </div>

              <div className="rounded-2xl bg-[#eaf2ff] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                  E-pošta
                </p>
                <a
                  href="mailto:info@cleanix.si"
                  className="text-xl font-bold text-[#123b7a] hover:text-[#2f6fe4]"
                >
                  info@cleanix.si
                </a>
              </div>

              <div className="rounded-2xl bg-[#eaf2ff] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                  Lokacija
                </p>
                <p className="text-xl font-bold text-[#123b7a]">
                  Ljubljana, Slovenija
                </p>
              </div>

              <div className="rounded-2xl bg-[#eaf2ff] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                  Delovni čas
                </p>
                <div className="space-y-2 text-[#123b7a]">
                  <p>Pon - Pet: 08:00 - 18:00</p>
                  <p>Sobota: 09:00 - 14:00</p>
                  <p>Nedelja: po dogovoru</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-[#123b7a] p-8 text-white shadow-sm sm:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#c8dbff]">
              HITRA REZERVACIJA
            </p>
            <h2 className="mb-4 text-4xl font-bold">
              Potrebujete čiščenje čim prej?
            </h2>
            <p className="mb-8 max-w-md leading-8 text-[#eaf2ff]">
              Najhitrejša pot je spletna rezervacija. Izberite storitev, termin
              in oddajte naročilo v nekaj minutah.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/booking"
                className="rounded-full bg-[#2f6fe4] px-6 py-3 font-bold !text-white transition hover:bg-white hover:!text-[#123b7a]"
              >
                Rezerviraj zdaj
              </a>

              <a
                href="/"
                className="rounded-full border border-white/40 bg-white px-6 py-3 font-bold !text-[#123b7a] transition hover:bg-[#2f6fe4] hover:!text-white"
              >
                Nazaj domov
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
