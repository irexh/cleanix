export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-16 text-[#173e35]">
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
              <div className="rounded-2xl bg-[#f8f5ef] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#6b8178]">
                  Telefon
                </p>
                <a
                  href="tel:069665229"
                  className="text-xl font-bold text-[#173e35] hover:text-[#2b8c73]"
                >
                  069 665 229
                </a>
              </div>

              <div className="rounded-2xl bg-[#f8f5ef] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#6b8178]">
                  E-pošta
                </p>
                <a
                  href="mailto:info@cleanix.si"
                  className="text-xl font-bold text-[#173e35] hover:text-[#2b8c73]"
                >
                  info@cleanix.si
                </a>
              </div>

              <div className="rounded-2xl bg-[#f8f5ef] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#6b8178]">
                  Lokacija
                </p>
                <p className="text-xl font-bold text-[#173e35]">
                  Ljubljana, Slovenija
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f5ef] p-5">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[#6b8178]">
                  Delovni čas
                </p>
                <div className="space-y-2 text-[#173e35]">
                  <p>Pon - Pet: 08:00 - 18:00</p>
                  <p>Sobota: 09:00 - 14:00</p>
                  <p>Nedelja: po dogovoru</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-[#173e35] p-8 text-white shadow-sm sm:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#9fcabd]">
              Hitra rezervacija
            </p>
            <h2 className="mb-4 text-4xl font-bold">
              Potrebujete čiščenje čim prej?
            </h2>
            <p className="mb-8 max-w-md leading-8 text-[#c7ddd5]">
              Najhitrejša pot je spletna rezervacija. Izberite storitev, termin
              in oddajte naročilo v nekaj minutah.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/booking"
                className="rounded-full bg-[#ef856d] px-6 py-3 font-bold text-white transition hover:bg-[#d9735d]"
              >
                Rezerviraj zdaj
              </a>

              <a
                href="/"
                className="rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-[#173e35]"
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