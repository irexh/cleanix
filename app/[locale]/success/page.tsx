export default function SuccessPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#e8f4ed] p-6">
      <section className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mb-6 text-6xl">✓</div>

        <p className="mb-3 text-sm font-bold tracking-wider text-[#2b8c73]">
          PLAČILO USPEŠNO
        </p>

        <h1 className="text-4xl font-bold text-[#173e35]">
          Hvala za rezervacijo!
        </h1>

        <p className="mt-5 leading-7 text-[#5d716a]">
          Vaše plačilo je bilo uspešno. Potrditev rezervacije smo poslali na
          vaš e-poštni naslov.
        </p>

        <a
          href="/"
          className="mt-8 inline-block rounded-full bg-[#2b8c73] px-6 py-3 font-bold text-white transition hover:bg-[#1d6c58]"
        >
          Nazaj na začetno stran
        </a>
      </section>
    </main>
  );
}