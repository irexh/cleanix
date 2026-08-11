import {redirect} from "next/navigation";

import {auth} from "@/auth";
import LogoutButton from "@/components/customer/LogoutButton";
import {prisma} from "@/lib/prisma";

import {
  cancelClaimedBookingAction,
  claimBookingAction,
  updateEmployeeBookingStatusAction
} from "./actions";

const statusLabels: Record<string, string> = {
  PENDING: "Čaka",
  CONFIRMED: "Prevzeto",
  IN_PROGRESS: "Na poti",
  COMPLETED: "Opravljeno",
  CANCELLED: "Preklicano"
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-cyan-100 text-cyan-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800"
};

type EmployeeBooking = {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  propertyType: string;
  propertySize: string;
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
  bookingStatus: string;
  employeeId: string | null;
};

export default async function EmployeePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sl/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/sl/admin");
  }

  if (session.user.role !== "EMPLOYEE" && session.user.role !== "MANAGER") {
    redirect("/sl/profile");
  }

  const employee = await prisma.employee.findFirst({
    where: {email: session.user.email},
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true
    }
  });

  if (!employee) {
    redirect("/sl/profile");
  }

  const bookings = (await prisma.booking.findMany({
    where: {
      OR: [{employeeId: null}, {employeeId: employee.id}],
      bookingStatus: {
        in: ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
      }
    },
    orderBy: [{selectedDate: "asc"}, {selectedTime: "asc"}],
    select: {
      id: true,
      fullName: true,
      phone: true,
      city: true,
      address: true,
      propertyType: true,
      propertySize: true,
      selectedDate: true,
      selectedTime: true,
      totalPrice: true,
      bookingStatus: true,
      employeeId: true
    }
  })) as EmployeeBooking[];

  const availableBookings = bookings.filter((booking) => booking.employeeId == null);
  const myBookings = bookings.filter((booking) => booking.employeeId === employee.id);

  const counts = {
    available: availableBookings.length,
    mine: myBookings.length,
    prevzeto: myBookings.filter((booking) => booking.bookingStatus === "CONFIRMED").length,
    naPoti: myBookings.filter((booking) => booking.bookingStatus === "IN_PROGRESS").length,
    opravljeno: myBookings.filter((booking) => booking.bookingStatus === "COMPLETED").length,
    preklicano: myBookings.filter((booking) => booking.bookingStatus === "CANCELLED").length
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-4 py-4 text-[#123b7a] sm:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX EMPLOYEE
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Čistilkin dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#5d716a]">
              Preveri proste naloge, prevzemi delo in spremljaj status do
              zaključka.
            </p>
          </div>

          <LogoutButton />
        </div>

        <section className="grid gap-3 lg:grid-cols-3">
          <Card title="Moj profil">
            <InfoRow label="Ime" value={employee.name} />
            <InfoRow label="E-pošta" value={employee.email || "Ni podatka"} />
            <InfoRow label="Telefon" value={employee.phone || "Ni podatka"} />
            <InfoRow label="Status" value={employee.isActive ? "Aktivna" : "Neaktivna"} />
          </Card>

          <Card title="Pregled">
            <InfoRow label="Prosti nalogi" value={String(counts.available)} />
            <InfoRow label="Moji nalogi" value={String(counts.mine)} />
            <InfoRow label="Prevzeto" value={String(counts.prevzeto)} />
            <InfoRow label="Na poti" value={String(counts.naPoti)} />
          </Card>

          <Card title="Hitro">
            <SettingPill label="Vloga" value="Čistilka" />
            <SettingPill label="Prevzem nalogov" value="Ročno" />
            <SettingPill label="Obvestila" value="Vklopljeno" />
          </Card>
        </section>

        <section className="mt-4 rounded-[20px] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Prosti nalogi</h2>
              <p className="mt-1 text-xs text-[#5d716a]">
                Nalog lahko prevzameš s klikom na gumb.
              </p>
            </div>
            <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-bold text-[#2f6fe4]">
              {counts.available}
            </span>
          </div>

          {availableBookings.length === 0 ? (
            <p className="rounded-xl bg-[#f6f9ff] p-3 text-center text-xs text-[#5d716a]">
              Trenutno ni prostih nalogov.
            </p>
          ) : (
            <div className="grid gap-2">
              {availableBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="grid gap-2 rounded-xl border border-[#dbe7fb] bg-[#f6f9ff] p-3 lg:grid-cols-[1fr_1.2fr_160px]"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Stranka
                    </p>
                    <h3 className="text-sm font-bold text-[#123b7a]">
                      {booking.fullName}
                    </h3>
                    <p className="text-xs text-[#5d716a]">{booking.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Termin
                    </p>
                    <p className="text-sm font-bold text-[#123b7a]">
                      {booking.selectedDate} ob {booking.selectedTime}
                    </p>
                    <p className="text-xs text-[#5d716a]">
                      {booking.city}, {booking.address}
                    </p>
                    <p className="text-xs text-[#5d716a]">
                      {booking.propertyType} · {booking.propertySize}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        statusStyles[booking.bookingStatus] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[booking.bookingStatus] ?? booking.bookingStatus}
                    </span>
                    <p className="text-sm font-bold text-[#123b7a]">
                      EUR {booking.totalPrice}
                    </p>
                    <form action={claimBookingAction}>
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <button
                        type="submit"
                        className="rounded-full bg-[#2f6fe4] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#123b7a]"
                      >
                        Prevzemi
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 rounded-[20px] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Moji nalogi</h2>
              <p className="mt-1 text-xs text-[#5d716a]">
                Tukaj vidiš vse naloge, ki si jih že prevzela.
              </p>
            </div>
            <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-bold text-[#2f6fe4]">
              {counts.mine}
            </span>
          </div>

          {myBookings.length === 0 ? (
            <p className="rounded-xl bg-[#f6f9ff] p-3 text-center text-xs text-[#5d716a]">
              Trenutno nimaš dodeljenih nalogov.
            </p>
          ) : (
            <div className="grid gap-2">
              {myBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="grid gap-2 rounded-xl border border-[#dbe7fb] bg-[#f6f9ff] p-3 lg:grid-cols-[1fr_1.15fr_190px]"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Stranka
                    </p>
                    <h3 className="text-sm font-bold text-[#123b7a]">
                      {booking.fullName}
                    </h3>
                    <p className="text-xs text-[#5d716a]">{booking.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Termin
                    </p>
                    <p className="text-sm font-bold text-[#123b7a]">
                      {booking.selectedDate} ob {booking.selectedTime}
                    </p>
                    <p className="text-xs text-[#5d716a]">
                      {booking.city}, {booking.address}
                    </p>
                    <p className="text-xs text-[#5d716a]">
                      {booking.propertyType} · {booking.propertySize}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        statusStyles[booking.bookingStatus] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[booking.bookingStatus] ?? booking.bookingStatus}
                    </span>
                    <p className="text-sm font-bold text-[#123b7a]">
                      EUR {booking.totalPrice}
                    </p>

                    {booking.bookingStatus === "CONFIRMED" ? (
                      <form action={updateEmployeeBookingStatusAction}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="status" value="IN_PROGRESS" />
                        <button
                          type="submit"
                          className="rounded-full bg-[#0ea5e9] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0369a1]"
                        >
                          Na poti
                        </button>
                      </form>
                    ) : booking.bookingStatus === "IN_PROGRESS" ? (
                      <form action={updateEmployeeBookingStatusAction}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="status" value="COMPLETED" />
                        <button
                          type="submit"
                          className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                        >
                          Opravljeno
                        </button>
                      </form>
                    ) : null}

                    {booking.bookingStatus !== "COMPLETED" &&
                    booking.bookingStatus !== "CANCELLED" ? (
                      <form action={cancelClaimedBookingAction} className="grid gap-2">
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <p className="rounded-xl bg-amber-50 px-2.5 py-2 text-[11px] leading-4 text-amber-800">
                          Če prekličeš manj kot 24 ur pred terminom, je to v
                          nasprotju s pravili Cleanix.
                        </p>
                        <textarea
                          name="cancelReason"
                          required
                          minLength={10}
                          rows={2}
                          placeholder="Razlog preklica"
                          className="w-full rounded-xl border border-[#cfe0ff] bg-white px-3 py-2 text-xs font-medium text-[#123b7a] outline-none focus:border-[#2f6fe4]"
                        />
                        <button
                          type="submit"
                          className="w-fit rounded-full border border-red-500 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          Prekliči
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 rounded-[20px] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Statistika dela</h2>
              <p className="mt-1 text-xs text-[#5d716a]">
                Kratek pregled statusov.
              </p>
            </div>
            <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-bold text-[#2f6fe4]">
              XS
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="Prevzeto" value={String(counts.prevzeto)} />
            <MiniStat label="Na poti" value={String(counts.naPoti)} />
            <MiniStat label="Opravljeno" value={String(counts.opravljeno)} />
            <MiniStat label="Preklicano" value={String(counts.preklicano)} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-sm">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <div className="border-b border-[#ece7dc] pb-2 last:border-b-0 last:pb-0">
      <p className="text-[11px] font-semibold text-[#5d716a]">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-[#123b7a]">
        {value}
      </p>
    </div>
  );
}

function SettingPill({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-[#123b7a]">{value}</p>
    </div>
  );
}

function MiniStat({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-[#123b7a]">{value}</p>
    </div>
  );
}
