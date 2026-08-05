import AdminBookingActions from "@/components/admin/AdminBookingActions";
import AdminFilters from "@/components/admin/AdminFilters";
import {prisma} from "@/lib/prisma";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const statusLabels: Record<string, string> = {
  PENDING: "Caka na potrditev",
  CONFIRMED: "Potrjeno",
  IN_PROGRESS: "V teku",
  COMPLETED: "Zakljuceno",
  CANCELLED: "Preklicano"
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800"
};

type AdminPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function AdminPage({searchParams}: AdminPageProps) {
  const params = searchParams ? await searchParams : {};
  const search = params.q?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  const bookings = await prisma.booking.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {fullName: {contains: search}},
              {email: {contains: search}},
              {city: {contains: search}}
            ]
          }
        : {}),
      ...(status && status !== "ALL"
        ? {
            bookingStatus: status
          }
        : {})
    },
    orderBy: {createdAt: "desc"},
    include: {employee: true}
  });

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "PAID"
  );

  const revenue = paidBookings.reduce(
    (total, booking) => total + booking.totalPrice,
    0
  );

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-10 text-[#173e35]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <a href="/" className="brand">
              <span className="brand-mark">✦</span>
              čisto
            </a>
            <h1 className="mt-6 text-4xl font-bold">Nadzorna plosca</h1>
            <p className="mt-2 text-[#5d716a]">
              Pregled vseh rezervacij in placil.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
  <a
    href="/"
    className="rounded-full border border-[#173e35] px-5 py-3 text-sm font-bold transition hover:bg-[#173e35] hover:text-white"
  >
    Nazaj na spletno stran
  </a>

  <AdminLogoutButton />
</div>
        </header>

        <section className="mb-10 grid gap-5 sm:grid-cols-3">
          <StatCard label="Vse rezervacije" value={String(bookings.length)} />
          <StatCard
            label="Placane rezervacije"
            value={String(paidBookings.length)}
          />
          <StatCard label="Prihodki" value={`EUR ${revenue}`} />
        </section>

        <AdminFilters />

        <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="border-b p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Rezervacije</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-10 text-center text-[#5d716a]">
              Ni zadetkov za izbrane filtre.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left">
                <thead className="bg-[#e8f4ed] text-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold">Stranka</th>
                    <th className="px-6 py-4 font-bold">Termin</th>
                    <th className="px-6 py-4 font-bold">Storitev</th>
                    <th className="px-6 py-4 font-bold">Znesek</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Upravljanje</th>
<th className="px-6 py-4 font-bold">Podrobnosti</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t align-top">
                      <td className="px-6 py-5">
                        <p className="font-bold">{booking.fullName}</p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          {booking.email}
                        </p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          {booking.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {booking.selectedDate} - {booking.selectedTime}
                        </p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          {booking.city}
                        </p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          {booking.address}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold">{booking.propertyType}</p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          {booking.propertySize}
                        </p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          Kopalnice: {booking.bathrooms}
                        </p>
                        <p className="mt-2 text-sm font-bold text-[#123b7a]">
                          Ekipa: {booking.employee?.name ?? "Ni dodeljeno"}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-bold">
                        EUR {booking.totalPrice}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            statusColors[booking.bookingStatus] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {statusLabels[booking.bookingStatus] ??
                            booking.bookingStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <AdminBookingActions
                          bookingId={booking.id}
                          currentStatus={booking.bookingStatus}
                        />
                      </td>
                      <td className="px-6 py-5">
  <a
    href={`/admin/bookings/${booking.id}`}
    className="inline-flex rounded-full border border-[#173e35] px-4 py-2 text-sm font-bold text-[#173e35] transition hover:bg-[#173e35] hover:text-white"
  >
    Odpri
  </a>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#5d716a]">{label}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
    </div>
  );
}
