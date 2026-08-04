import {prisma} from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  PENDING: "Čaka na potrditev",
  CONFIRMED: "Potrjeno",
  IN_PROGRESS: "V teku",
  COMPLETED: "Zaključeno",
  CANCELLED: "Preklicano"
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800"
};

function formatDateLabel(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("sl-SI", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(parsedDate);
}

export default async function AdminCalendarPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: [
      {selectedDate: "asc"},
      {selectedTime: "asc"}
    ]
  });

  const groupedBookings = bookings.reduce<Record<string, typeof bookings>>(
    (groups, booking) => {
      groups[booking.selectedDate] ??= [];
      groups[booking.selectedDate].push(booking);
      return groups;
    },
    {}
  );

  const bookingDates = Object.keys(groupedBookings);

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX ADMIN
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
              Calendar
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
              Pregled vseh rezervacij po datumu in uri. Tukaj bomo kasneje
              dodali tudi dodeljevanje zaposlenih in status dela.
            </p>
          </div>

          <div className="rounded-3xl bg-white px-6 py-4 text-right shadow-sm">
            <p className="text-sm font-bold text-[#5d716a]">Vseh terminov</p>
            <p className="mt-1 text-4xl font-extrabold">{bookings.length}</p>
          </div>
        </div>

        {bookingDates.length === 0 ? (
          <section className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">Ni terminov</h2>
            <p className="mt-3 text-[#5d716a]">
              Ko stranka pošlje rezervacijo, se bo termin prikazal tukaj.
            </p>
          </section>
        ) : (
          <section className="grid gap-5">
            {bookingDates.map((date) => (
              <article key={date} className="overflow-hidden rounded-[32px] bg-white shadow-sm">
                <header className="border-b border-[#dbe7fb] bg-[#eaf2ff] px-6 py-5">
                  <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#4d8dff]">
                    {formatDateLabel(date)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#5d716a]">
                    {groupedBookings[date].length} terminov
                  </p>
                </header>

                <div className="divide-y divide-[#edf3ff]">
                  {groupedBookings[date].map((booking) => (
                    <div
                      key={booking.id}
                      className="grid gap-4 px-6 py-5 lg:grid-cols-[110px_1.2fr_1fr_160px_120px] lg:items-center"
                    >
                      <div>
                        <p className="text-2xl font-extrabold text-[#123b7a]">
                          {booking.selectedTime}
                        </p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                          ura
                        </p>
                      </div>

                      <div>
                        <p className="text-lg font-extrabold">{booking.fullName}</p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          {booking.email} · {booking.phone}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold">{booking.address}</p>
                        <p className="mt-1 text-sm text-[#5d716a]">
                          {booking.city} · {booking.propertyType} · {booking.propertySize}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            statusColors[booking.bookingStatus] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {statusLabels[booking.bookingStatus] ?? booking.bookingStatus}
                        </span>
                        <p className="mt-2 text-sm font-bold">EUR {booking.totalPrice}</p>
                      </div>

                      <a
                        href={`/sl/admin/bookings/${booking.id}`}
                        className="inline-flex justify-center rounded-full border border-[#123b7a] px-4 py-2 text-sm font-bold transition hover:bg-[#123b7a] hover:text-white"
                      >
                        Odpri
                      </a>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
