import {prisma} from "@/lib/prisma";

export default async function AdminCompaniesPage() {
  const bookings = await prisma.booking.findMany({
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
              Companies
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
              Tukaj zbiramo poslovne stranke in povpraševanja za poslovne
              prostore. Kasneje dodamo ponudbe, pogodbe in kontaktne osebe.
            </p>
          </div>

          <div className="rounded-3xl bg-white px-6 py-4 text-right shadow-sm">
            <p className="text-sm font-bold text-[#5d716a]">Poslovnih vnosov</p>
            <p className="mt-1 text-4xl font-extrabold">{bookings.length}</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <section className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">Ni poslovnih strank</h2>
            <p className="mt-3 text-[#5d716a]">
              Ko prejmete povpraševanje ali rezervacijo za poslovni prostor, se
              bo prikazala tukaj.
            </p>
          </section>
        ) : (
          <section className="grid gap-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="grid gap-5 rounded-[28px] bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_1fr_140px]"
              >
                <div>
                  <h2 className="text-2xl font-extrabold">{booking.fullName}</h2>
                  <p className="mt-2 text-sm text-[#5d716a]">
                    {booking.email} · {booking.phone}
                  </p>
                </div>

                <div>
                  <p className="font-bold">{booking.address}</p>
                  <p className="mt-1 text-sm text-[#5d716a]">
                    {booking.city} · {booking.propertySize}
                  </p>
                </div>

                <a
                  href={`/sl/admin/bookings/${booking.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-[#123b7a] px-4 py-2 text-sm font-bold transition hover:bg-[#123b7a] hover:text-white"
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
