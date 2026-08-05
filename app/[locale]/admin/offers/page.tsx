import {prisma} from "@/lib/prisma";

export default async function AdminOffersPage() {
  const businessBookings = await prisma.booking.findMany({
    where: {
      propertyType: {
        contains: "Poslovni"
      }
    },
    orderBy: {createdAt: "desc"}
  });

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX BUSINESS
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
              Offers
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
              Osnova za pripravo ponudb podjetjem. Za zdaj prikazujemo poslovne
              rezervacije, kasneje dodamo status ponudbe in PDF.
            </p>
          </div>
        </div>

        {businessBookings.length === 0 ? (
          <section className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">Ni ponudb</h2>
            <p className="mt-3 text-[#5d716a]">
              Poslovna povpraševanja bomo kasneje pretvorili v ponudbe.
            </p>
          </section>
        ) : (
          <section className="grid gap-4">
            {businessBookings.map((booking) => (
              <article key={booking.id} className="rounded-[28px] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold">{booking.fullName}</h2>
                    <p className="mt-2 text-sm text-[#5d716a]">
                      {booking.email} · {booking.phone}
                    </p>
                    <p className="mt-4 font-bold">{booking.address}, {booking.city}</p>
                  </div>

                  <a
                    href={`/sl/admin/bookings/${booking.id}`}
                    className="rounded-full border border-[#123b7a] px-5 py-3 text-sm font-bold transition hover:bg-[#123b7a] hover:text-white"
                  >
                    Odpri osnovo za ponudbo
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
