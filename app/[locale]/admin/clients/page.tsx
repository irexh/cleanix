import {prisma} from "@/lib/prisma";

export default async function AdminClientsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: {createdAt: "desc"}
  });

  const clients = Array.from(
    bookings
      .reduce((map, booking) => {
        const key = booking.email.toLowerCase();
        const existing = map.get(key);

        if (!existing) {
          map.set(key, {
            fullName: booking.fullName,
            email: booking.email,
            phone: booking.phone,
            bookings: [booking],
            lastBooking: booking.createdAt
          });
          return map;
        }

        existing.bookings.push(booking);

        if (booking.createdAt > existing.lastBooking) {
          existing.fullName = booking.fullName;
          existing.phone = booking.phone;
          existing.lastBooking = booking.createdAt;
        }

        return map;
      }, new Map<string, {
        fullName: string;
        email: string;
        phone: string;
        bookings: typeof bookings;
        lastBooking: Date;
      }>())
      .values()
  );

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX ADMIN
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
              Clients
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
              Pregled strank iz vseh rezervacij. Kasneje bomo dodali ročno
              urejanje, opombe in zgodovino komunikacije.
            </p>
          </div>

          <div className="rounded-3xl bg-white px-6 py-4 text-right shadow-sm">
            <p className="text-sm font-bold text-[#5d716a]">Vseh strank</p>
            <p className="mt-1 text-4xl font-extrabold">{clients.length}</p>
          </div>
        </div>

        {clients.length === 0 ? (
          <section className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">Ni strank</h2>
            <p className="mt-3 text-[#5d716a]">
              Stranke se bodo prikazale tukaj, ko prejmete rezervacije.
            </p>
          </section>
        ) : (
          <section className="grid gap-4">
            {clients.map((client) => (
              <article
                key={client.email}
                className="grid gap-5 rounded-[28px] bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_1fr_160px]"
              >
                <div>
                  <h2 className="text-2xl font-extrabold">{client.fullName}</h2>
                  <p className="mt-2 text-sm text-[#5d716a]">
                    {client.email} · {client.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                    Zadnja rezervacija
                  </p>
                  <p className="mt-2 font-bold">
                    {client.bookings[0]?.selectedDate} ob {client.bookings[0]?.selectedTime}
                  </p>
                  <p className="mt-1 text-sm text-[#5d716a]">
                    {client.bookings[0]?.city}, {client.bookings[0]?.address}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#eaf2ff] p-4 text-center">
                  <p className="text-3xl font-extrabold">{client.bookings.length}</p>
                  <p className="mt-1 text-sm font-bold text-[#5d716a]">rezervacij</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
