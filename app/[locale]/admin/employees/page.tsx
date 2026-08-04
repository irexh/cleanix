const roles = [
  {
    title: "Admin",
    text: "Poln dostop do vseh nastavitev, uporabnikov, rezervacij in vsebine."
  },
  {
    title: "Manager",
    text: "Upravlja stranke, podjetja, ponudbe, koledar in naloge zaposlenih."
  },
  {
    title: "Employee",
    text: "V prihodnje vidi svoje termine, naloge in status dela."
  }
];

export default function AdminEmployeesPage() {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Employees
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Tukaj bomo upravljali zaposlene, njihove vloge, razpoložljivost in
          dodeljene naloge.
        </p>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {roles.map((role) => (
            <article key={role.title} className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#4d8dff]">
                Vloga
              </p>
              <h2 className="text-2xl font-extrabold">{role.title}</h2>
              <p className="mt-3 leading-7 text-[#5d716a]">{role.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Naslednji korak</h2>
          <p className="mt-3 text-[#5d716a]">
            Dodamo tabelo zaposlenih in obrazec za ustvarjanje uporabnikov z
            vlogami admin, manager in employee.
          </p>
        </section>
      </div>
    </main>
  );
}
