import {prisma} from "@/lib/prisma";

export default async function AdminInboxPage() {
  const bookings = await prisma.booking.findMany({
    where: {bookingStatus: "PENDING"},
    orderBy: {createdAt: "desc"}
  });

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX ADMIN
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
              Inbox
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
              Nova povpraševanja in rezervacije, ki čakajo na potrditev.
            </p>
          </div>

          <div className="rounded-3xl bg-white px-6 py-4 text-right shadow-sm">
            <p className="text-sm font-bold text-[#5d716a]">Čaka na potrditev</p>
            <p className="mt-1 text-4xl font-extrabold">{bookings.length}</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <section className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">Inbox je prazen</h2>
            <p className="mt-3 text-[#5d716a]">
              Trenutno ni novih rezervacij, ki čakajo na potrditev.
            </p>
          </section>
        ) : (
          <section className="grid gap-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="grid gap-5 rounded-[28px] bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_1fr_150px]"
              >
                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-amber-600">
                    Novo povpraševanje
                  </p>
                  <h2 className="text-2xl font-extrabold">{booking.fullName}</h2>
                  <p className="mt-2 text-sm text-[#5d716a]">
                    {booking.email} · {booking.phone}
                  </p>
                </div>

                <div>
                  <p className="font-bold">
                    {booking.selectedDate} ob {booking.selectedTime}
                  </p>
                  <p className="mt-1 text-sm text-[#5d716a]">
                    {booking.city}, {booking.address}
                  </p>
                  <p className="mt-1 text-sm text-[#5d716a]">
                    {booking.propertyType} · EUR {booking.totalPrice}
                  </p>
                </div>

                <a
                  href={`/sl/admin/bookings/${booking.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#2f6fe4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#215ac0]"
                >
                  Odpri
                </a>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
