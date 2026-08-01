export default function CancelPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fff1ed] p-6">
      <section className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mb-6 text-6xl">×</div>

        <p className="mb-3 text-sm font-bold tracking-wider text-[#c85f4b]">
          PLAČILO PREKINJENO
        </p>

        <h1 className="text-4xl font-bold text-[#173e35]">
          Rezervacija še ni potrjena.
        </h1>

        <p className="mt-5 leading-7 text-[#5d716a]">
          Plačilo ni bilo izvedeno. Brez skrbi — svojo rezervacijo lahko
          kadar koli začnete znova.
        </p>

        <a
          href="/booking"
          className="mt-8 inline-block rounded-full bg-[#ef856d] px-6 py-3 font-bold text-white transition hover:bg-[#d9735d]"
        >
          Nazaj na rezervacijo
        </a>
      </section>
    </main>
  );
}