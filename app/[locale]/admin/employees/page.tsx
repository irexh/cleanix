import {
  createEmployeeAction,
  toggleEmployeeAction
} from "@/app/[locale]/admin/employees/actions";
import {employeePrisma} from "@/lib/employee-prisma";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee"
};

export default async function AdminEmployeesPage() {
  const employees = await employeePrisma.employee.findMany({
    orderBy: [{isActive: "desc"}, {createdAt: "desc"}]
  });

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
          Upravljaj ekipo, kontakte, vloge in aktivnost zaposlenih.
        </p>

        <section className="mt-8 rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-2xl font-extrabold">Dodaj zaposlenega</h2>

          <form
            action={createEmployeeAction}
            className="grid gap-y-5 gap-x-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_160px] lg:items-start"
          >
            <label className="grid gap-2 text-sm font-bold">
              Ime
              <input
                name="name"
                required
                placeholder="npr. Ana Novak"
                className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              E-mail
              <input
                name="email"
                type="email"
                placeholder="ana@cleanix.si"
                className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Telefon
              <input
                name="phone"
                placeholder="040 000 000"
                className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
              />
            </label>

            <div className="hidden lg:block lg:col-start-4 lg:row-start-1">
              <div className="h-7" />
              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-[#2f6fe4] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#123b7a]"
              >
                Dodaj
              </button>
            </div>

            <label className="grid gap-2 text-sm font-bold">
              Role
              <select
                name="role"
                defaultValue="EMPLOYEE"
                className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff] lg:col-start-4 lg:row-start-2"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>

            <button
              type="submit"
              className="rounded-full bg-[#2f6fe4] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#123b7a] lg:hidden"
            >
              Dodaj
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">Ekipa</h2>

          {employees.length === 0 ? (
            <p className="mt-4 text-[#5d716a]">Ni dodanih zaposlenih.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {employees.map((employee) => (
                <article
                  key={employee.id}
                  className="grid gap-4 rounded-2xl border border-[#dbe7fb] bg-[#f6f9ff] p-5 lg:grid-cols-[1.3fr_1fr_1fr_180px_170px]"
                >
                  <div>
                    <h3 className="text-xl font-extrabold text-[#123b7a]">
                      {employee.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-[#5d716a]">
                      {roleLabels[employee.role] ?? employee.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5d716a]">
                      E-mail
                    </p>
                    <p className="mt-1 break-all text-sm font-bold">
                      {employee.email || "Ni podatka"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5d716a]">
                      Telefon
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {employee.phone || "Ni podatka"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5d716a]">
                      Status
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${
                        employee.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {employee.isActive ? "Aktivno" : "Neaktivno"}
                    </span>
                  </div>

                  <form action={toggleEmployeeAction} className="flex items-center gap-3">
                    <input type="hidden" name="id" value={employee.id} />
                    <label className="flex items-center gap-2 text-sm font-bold">
                      <input
                        name="isActive"
                        type="checkbox"
                        defaultChecked={employee.isActive}
                      />
                      Aktivno
                    </label>
                    <button
                      type="submit"
                      className="rounded-full border border-[#123b7a] px-4 py-2 text-sm font-extrabold text-[#123b7a] transition hover:bg-[#123b7a] hover:text-white"
                    >
                      Shrani
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
