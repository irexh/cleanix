import BookingWizard from "@/components/BookingWizard";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] py-12">
      <div className="mx-auto mb-10 flex max-w-7xl items-center justify-between px-6">
        <a href="/" className="brand" aria-label="Cleanix domov">
          <span className="brand-mark">✦</span>
          cleanix
        </a>

        <a href="/" className="text-link">
          ← Nazaj na začetno stran
        </a>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">
          <span /> REZERVACIJA ČIŠČENJA
        </p>

        <h1 className="mb-4 max-w-2xl text-5xl font-bold">
          Rezervirajte čiščenje doma.
        </h1>

        <p className="mb-12 max-w-xl text-lg leading-7 text-[#5d716a]">
          V nekaj preprostih korakih izberite storitev, termin in vnesite
          podatke za rezervacijo.
        </p>
      </div>

      <BookingWizard />
    </main>
  );
}