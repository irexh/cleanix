export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-16 text-[#173e35]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl">
          <p className="eyebrow">
            <span /> O NAS
          </p>
          <h1 className="mb-5 text-5xl font-bold">
            Cleanix je zanesljiv partner za čist in miren dom.
          </h1>
          <p className="text-lg leading-8 text-[#5d716a]">
            Verjamemo, da kakovostno čiščenje ni luksuz, ampak storitev, ki mora
            biti preprosta, pregledna in zanesljiva. Zato smo Cleanix zasnovali
            tako, da je rezervacija hitra, storitev pa profesionalna in točna.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
            <h2 className="mb-6 text-2xl font-bold">Kaj nas vodi</h2>

            <div className="grid gap-5">
              <div className="rounded-2xl bg-[#f8f5ef] p-5">
                <h3 className="mb-2 text-lg font-bold">Preprostost</h3>
                <p className="leading-7 text-[#5d716a]">
                  Rezervacija mora biti hitra in brez zapletov. Nekaj klikov,
                  jasna cena in takojšnja potrditev.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f5ef] p-5">
                <h3 className="mb-2 text-lg font-bold">Zanesljivost</h3>
                <p className="leading-7 text-[#5d716a]">
                  Stranke morajo vedeti, da ekipa pride pravočasno in opravi
                  delo natančno, odgovorno in profesionalno.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f5ef] p-5">
                <h3 className="mb-2 text-lg font-bold">Zaupanje</h3>
                <p className="leading-7 text-[#5d716a]">
                  Dom je osebni prostor. Zato je za nas ključno, da storitev
                  temelji na spoštovanju, diskretnosti in kakovosti.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-[#173e35] p-8 text-white shadow-sm sm:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#9fcabd]">
              Cleanix v praksi
            </p>
            <h2 className="mb-5 text-4xl font-bold">
              Delujemo v Ljubljani in rastemo premišljeno.
            </h2>
            <p className="mb-8 leading-8 text-[#c7ddd5]">
              Naš fokus je trenutno Ljubljana, kjer gradimo storitev, ki združuje
              sodoben način rezervacije, pregledne cene in občutek zaupanja.
              Nove lokacije bomo dodajali postopoma, ko bo storitev na vsaki
              ravni dosegala naš standard.
            </p>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#9fcabd]">
                  Območje
                </p>
                <p className="mt-2 text-lg font-semibold">Ljubljana</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#9fcabd]">
                  Fokus
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Domovi, stanovanja in poslovni prostori
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#9fcabd]">
                  Rezervacija
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Online, hitro in pregledno
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-[32px] bg-[#e8f4ed] p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#5b7f72]">
                Potrebujete pomoč?
              </p>
              <h2 className="text-3xl font-bold">
                Če imate vprašanje, smo vam z veseljem na voljo.
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="rounded-full bg-[#173e35] px-6 py-3 font-bold text-white transition hover:bg-[#0f2b25]"
              >
                Kontakt
              </a>

              <a
                href="/booking"
                className="rounded-full border border-[#173e35] px-6 py-3 font-bold text-[#173e35] transition hover:bg-[#173e35] hover:text-white"
              >
                Rezerviraj zdaj
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}