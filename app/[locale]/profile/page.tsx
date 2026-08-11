import {redirect} from "next/navigation";

import {auth} from "@/auth";
import LogoutButton from "@/components/customer/LogoutButton";
import {prisma} from "@/lib/prisma";

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

type BookingItem = {
  id: string;
  selectedDate: string;
  selectedTime: string;
  propertyType: string;
  propertySize: string;
  city: string;
  address: string;
  totalPrice: number;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: Date;
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sl/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/sl/admin");
  }

  if (session.user.role === "EMPLOYEE" || session.user.role === "MANAGER") {
    redirect("/sl/employee");
  }

  const [user, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: {email: session.user.email},
      select: {name: true, email: true, role: true, createdAt: true}
    }),
    prisma.booking.findMany({
      where: {email: session.user.email},
      orderBy: {createdAt: "desc"},
      select: {
        id: true,
        selectedDate: true,
        selectedTime: true,
        propertyType: true,
        propertySize: true,
        city: true,
        address: true,
        totalPrice: true,
        bookingStatus: true,
        paymentStatus: true,
        createdAt: true
      }
    })
  ]);

  const typedBookings = bookings as BookingItem[];
  const upcomingBookings = typedBookings.filter(
    (booking) =>
      booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "COMPLETED"
  );

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-4 py-4 text-[#123b7a] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX PROFILE
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Moj račun
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#5d716a] sm:text-base">
              Tukaj so tvoji termini, podatki in nastavitve računa.
            </p>
          </div>

          <LogoutButton />
        </div>

        <section className="grid gap-3 lg:grid-cols-3">
          <Card title="Moj račun">
            <InfoRow label="Ime" value={user?.name || "Ni podatka"} />
            <InfoRow label="E-pošta" value={user?.email || "Ni podatka"} />
            <InfoRow
              label="Vloga"
              value={user?.role === "EMPLOYEE" ? "Čistilka" : "Stranka"}
            />
          </Card>

          <Card title="Moji termini">
            <InfoRow label="Skupaj" value={String(typedBookings.length)} />
            <InfoRow label="Aktivni" value={String(upcomingBookings.length)} />
            <InfoRow
              label="Zadnji"
              value={
                typedBookings[0]
                  ? `${typedBookings[0].selectedDate} ob ${typedBookings[0].selectedTime}`
                  : "Ni termina"
              }
            />
          </Card>

          <Card title="Nastavitve">
            <SettingPill label="Obvestila po e-pošti" value="Vklopljeno" />
            <SettingPill label="SMS opozorila" value="Po želji" />
            <SettingPill label="Jezik" value="Slovenščina" />
          </Card>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">Moji termini</h2>
              <p className="mt-1 text-sm text-[#5d716a]">
                Pregled prihodnjih in preteklih rezervacij.
              </p>
            </div>
          </div>

          {typedBookings.length === 0 ? (
            <p className="rounded-xl bg-[#f6f9ff] p-4 text-center text-sm text-[#5d716a]">
              Trenutno nimaš še nobenega termina.
            </p>
          ) : (
            <div className="grid gap-3">
              {typedBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="grid gap-3 rounded-xl border border-[#dbe7fb] bg-[#f6f9ff] p-4 lg:grid-cols-[1.1fr_1fr_180px]"
                >
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5d716a]">
                      Termin
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-[#123b7a]">
                      {booking.selectedDate} ob {booking.selectedTime}
                    </h3>
                    <p className="mt-1 text-sm text-[#5d716a]">
                      {booking.city}, {booking.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5d716a]">
                      Storitev
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#123b7a]">
                      {booking.propertyType}
                    </p>
                    <p className="mt-1 text-sm text-[#5d716a]">
                      {booking.propertySize}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                        statusStyles[booking.bookingStatus] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[booking.bookingStatus] ?? booking.bookingStatus}
                    </span>
                    <p className="text-sm font-bold text-[#123b7a]">
                      EUR {booking.totalPrice}
                    </p>
                    <p className="text-[11px] text-[#5d716a]">
                      Plačilo: {booking.paymentStatus}
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
      <h2 className="text-lg font-extrabold sm:text-xl">{title}</h2>
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
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5d716a]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#123b7a]">{value}</p>
    </div>
  );
}
