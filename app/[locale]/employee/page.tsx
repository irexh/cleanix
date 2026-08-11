import {redirect} from "next/navigation";

import {auth} from "@/auth";
import LogoutButton from "@/components/customer/LogoutButton";
import {prisma} from "@/lib/prisma";

import {claimBookingAction} from "./actions";

const statusLabels: Record<string, string> = {
  PENDING: "Caka na potrditev",
  CONFIRMED: "Potrjeno",
  IN_PROGRESS: "V teku",
  COMPLETED: "Zakljuceno",
  CANCELLED: "Preklicano"
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
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
      OR: [
        {employeeId: null},
        {employeeId: employee.id}
      ],
      bookingStatus: {
        in: ["PENDING", "CONFIRMED", "IN_PROGRESS"]
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

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-4 py-4 text-[#123b7a] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX EMPLOYEE
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Moji nalogi
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#5d716a] sm:text-base">
              Tukaj vidiš proste naloge in termine, ki si jih že prevzela.
            </p>
          </div>

          <LogoutButton />
        </div>

        <section className="grid gap-3 lg:grid-cols-3">
          <Card title="Moj profil">
            <InfoRow label="Ime" value={employee.name} />
            <InfoRow label="E-mail" value={employee.email || "Ni podatka"} />
            <InfoRow label="Telefon" value={employee.phone || "Ni podatka"} />
          </Card>

          <Card title="Prosti nalogi">
            <InfoRow label="Na voljo" value={String(availableBookings.length)} />
            <InfoRow label="Moji aktivni" value={String(myBookings.length)} />
            <InfoRow
              label="Status"
              value={employee.isActive ? "Aktivna" : "Neaktivna"}
            />
          </Card>

          <Card title="Nastavitve">
            <SettingPill label="Vloga" value="Cistilka" />
            <SettingPill label="Prevzem nalogov" value="Ročno" />
            <SettingPill label="Obvestila" value="Vklopljeno" />
          </Card>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold sm:text-xl">Prosti nalogi</h2>
            <p className="mt-1 text-sm text-[#5d716a]">
              Novi nalogi, ki jih lahko prevzameš sama.
            </p>
          </div>

          {availableBookings.length === 0 ? (
            <p className="rounded-xl bg-[#f6f9ff] p-4 text-center text-sm text-[#5d716a]">
              Trenutno ni prostih nalogov.
            </p>
          ) : (
            <div className="grid gap-3">
              {availableBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="grid gap-3 rounded-xl border border-[#dbe7fb] bg-[#f6f9ff] p-4 lg:grid-cols-[1.1fr_1fr_170px]"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Stranka
                    </p>
                    <h3 className="mt-1 text-base font-bold text-[#123b7a]">
                      {booking.fullName}
                    </h3>
                    <p className="mt-1 text-sm text-[#5d716a]">{booking.phone}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Termin
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#123b7a]">
                      {booking.selectedDate} ob {booking.selectedTime}
                    </p>
                    <p className="mt-1 text-sm text-[#5d716a]">
                      {booking.city}, {booking.address}
                    </p>
                    <p className="mt-1 text-sm text-[#5d716a]">
                      {booking.propertyType} · {booking.propertySize}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        statusStyles[booking.bookingStatus] ??
                        "bg-gray-100 text-gray-700"
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
                        Vzemi nalog
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold sm:text-xl">Moji nalogi</h2>
            <p className="mt-1 text-sm text-[#5d716a]">
              Nalogi, ki so trenutno dodeljeni tebi.
            </p>
          </div>

          {myBookings.length === 0 ? (
            <p className="rounded-xl bg-[#f6f9ff] p-4 text-center text-sm text-[#5d716a]">
              Trenutno nimaš dodeljenih nalogov.
            </p>
          ) : (
            <div className="grid gap-3">
              {myBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="grid gap-3 rounded-xl border border-[#dbe7fb] bg-[#f6f9ff] p-4 lg:grid-cols-[1.1fr_1fr_170px]"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Stranka
                    </p>
                    <h3 className="mt-1 text-base font-bold text-[#123b7a]">
                      {booking.fullName}
                    </h3>
                    <p className="mt-1 text-sm text-[#5d716a]">{booking.phone}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                      Termin
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#123b7a]">
                      {booking.selectedDate} ob {booking.selectedTime}
                    </p>
                    <p className="mt-1 text-sm text-[#5d716a]">
                      {booking.city}, {booking.address}
                    </p>
                    <p className="mt-1 text-sm text-[#5d716a]">
                      {booking.propertyType} · {booking.propertySize}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        statusStyles[booking.bookingStatus] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[booking.bookingStatus] ?? booking.bookingStatus}
                    </span>
                    <p className="text-sm font-bold text-[#123b7a]">
                      EUR {booking.totalPrice}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
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
    <section className="rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <div className="border-b border-[#ece7dc] pb-2 last:border-b-0 last:pb-0">
      <p className="text-xs font-semibold text-[#5d716a]">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-[#123b7a]">{value}</p>
    </div>
  );
}

function SettingPill({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#123b7a]">{value}</p>
    </div>
  );
}
