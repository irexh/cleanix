import {
  createEmployeeAction,
  createEmployeeLoginAction,
  deleteEmployeeAction,
  toggleEmployeeAction
} from "@/app/[locale]/admin/employees/actions";
import type {EmployeeRecord} from "@/lib/employee-prisma";
import {employeePrisma} from "@/lib/employee-prisma";
import {prisma} from "@/lib/prisma";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee"
};

export default async function AdminEmployeesPage() {
  const [employees, bookings] = (await Promise.all([
    employeePrisma.employee.findMany({
      orderBy: [{isActive: "desc"}, {createdAt: "desc"}]
    }),
    prisma.booking.findMany({
      where: {employeeId: {not: null}},
      select: {employeeId: true}
    })
  ])) as [EmployeeRecord[], Array<{employeeId: string | null}>];

  const bookingCounts = bookings.reduce<Record<string, number>>((acc, booking) => {
    if (booking.employeeId) {
      acc[booking.employeeId] = (acc[booking.employeeId] ?? 0) + 1;
    }

    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-4 py-4 text-[#123b7a] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d8dff]">
            CLEANIX ADMIN
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Employees
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5d716a] sm:text-base">
            Upravljaj ekipo, kontakte, vloge in aktivnost zaposlenih.
          </p>
        </div>

        <section className="rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-lg font-bold sm:text-xl">Dodaj zaposlenega</h2>

          <form
            action={createEmployeeAction}
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_140px]"
          >
            <label className="grid gap-1 text-xs font-bold text-[#123b7a]">
              Ime
              <input
                name="name"
                required
                placeholder="npr. Ana Novak"
                className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 text-sm outline-none focus:border-[#4d8dff] focus:bg-white"
              />
            </label>

            <label className="grid gap-1 text-xs font-bold text-[#123b7a]">
              E-mail
              <input
                name="email"
                type="email"
                placeholder="ana@cleanix.si"
                className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 text-sm outline-none focus:border-[#4d8dff] focus:bg-white"
              />
            </label>

            <label className="grid gap-1 text-xs font-bold text-[#123b7a]">
              Telefon
              <input
                name="phone"
                placeholder="040 000 000"
                className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 text-sm outline-none focus:border-[#4d8dff] focus:bg-white"
              />
            </label>

            <div className="hidden lg:flex lg:items-end">
              <button
                type="submit"
                className="admin-blue-button w-full px-4 py-2.5 text-sm"
              >
                Dodaj
              </button>
            </div>

            <label className="grid gap-1 text-xs font-bold text-[#123b7a] lg:col-span-2">
              Razpolozljivost
              <input
                name="availability"
                placeholder="npr. Pon-Pet 08:00-16:00"
                className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 text-sm outline-none focus:border-[#4d8dff] focus:bg-white"
              />
            </label>

            <label className="grid gap-1 text-xs font-bold text-[#123b7a] lg:col-span-2">
              Notes
              <input
                name="notes"
                placeholder="npr. Dela samo Ljubljana"
                className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5 text-sm outline-none focus:border-[#4d8dff] focus:bg-white"
              />
            </label>

            <label className="grid gap-1 text-xs font-bold text-[#123b7a] lg:col-start-4">
              Role
              <select
                name="role"
                defaultValue="EMPLOYEE"
                className="rounded-xl border border-[#dbe7fb] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4d8dff]"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>

            <button
              type="submit"
              className="admin-blue-button px-4 py-2.5 text-sm lg:hidden"
            >
              Dodaj
            </button>
          </form>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold sm:text-xl">Ekipa</h2>

          {employees.length === 0 ? (
            <p className="mt-3 text-sm text-[#5d716a]">Ni dodanih zaposlenih.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {employees.map((employee) => (
                <article
                  key={employee.id}
                  className="grid gap-3 rounded-[20px] border border-[#dbe7fb] bg-[#f6f9ff] p-4 lg:grid-cols-[1fr_1fr_1fr_160px_220px]"
                >
                  <div>
                    <h3 className="text-base font-bold text-[#123b7a]">
                      {employee.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#5d716a]">
                      {roleLabels[employee.role] ?? employee.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      E-mail
                    </p>
                    <p className="mt-1 break-all text-sm text-[#123b7a]">
                      {employee.email || "Ni podatka"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Telefon
                    </p>
                    <p className="mt-1 text-sm text-[#123b7a]">
                      {employee.phone || "Ni podatka"}
                    </p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Rezervacije
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#123b7a]">
                      {bookingCounts[employee.id] ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Status
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        employee.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {employee.isActive ? "Aktivno" : "Neaktivno"}
                    </span>

                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Razpolozljivost
                    </p>
                    <p className="mt-1 text-sm text-[#123b7a]">
                      {employee.availability || "Ni nastavljeno"}
                    </p>

                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Notes
                    </p>
                    <p className="mt-1 text-sm text-[#123b7a]">
                      {employee.notes || "Ni opomb"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <form action={toggleEmployeeAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={employee.id} />
                      <label className="flex items-center gap-2 text-sm font-bold text-[#123b7a]">
                        <input
                          name="isActive"
                          type="checkbox"
                          defaultChecked={employee.isActive}
                        />
                        Aktivno
                      </label>
                      <button
                        type="submit"
                        className="admin-blue-outline-button px-3 py-1.5 text-xs"
                      >
                        Shrani
                      </button>
                    </form>

                    <form action={toggleEmployeeAction}>
                      <input type="hidden" name="id" value={employee.id} />
                      <input
                        type="hidden"
                        name="isActive"
                        value={employee.isActive ? "" : "on"}
                      />
                      <button
                        type="submit"
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                          employee.isActive
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        }`}
                      >
                        {employee.isActive ? "Deaktiviraj" : "Aktiviraj"}
                      </button>
                    </form>

                    <form action={deleteEmployeeAction}>
                      <input type="hidden" name="id" value={employee.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-600 bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        Izbrisi
                      </button>
                    </form>
                  </div>

                  <form action={createEmployeeLoginAction} className="grid gap-2">
                    <input type="hidden" name="id" value={employee.id} />
                    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Geslo za login
                      <input
                        name="password"
                        type="password"
                        required
                        placeholder="npr. Cleanix123!"
                        className="rounded-xl border border-[#dbe7fb] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#4d8dff]"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#123b7a]">
                      <input name="sendEmail" type="checkbox" defaultChecked />
                      Poslji geslo na e-mail
                    </label>
                    <button
                      type="submit"
                      className="admin-blue-button px-3 py-2 text-xs"
                    >
                      Ustvari login
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
