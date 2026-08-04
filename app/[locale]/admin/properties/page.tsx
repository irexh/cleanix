import {prisma} from "@/lib/prisma";

export default async function AdminPropertiesPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: {createdAt: "desc"}
  });

  const properties = Array.from(
    bookings
      .reduce((map, booking) => {
        const key = `${booking.address}-${booking.city}`.toLowerCase();
        const existing = map.get(key);

        if (!existing) {
          map.set(key, {
            address: booking.address,
            city: booking.city,
            propertyType: booking.propertyType,
            propertySize: booking.propertySize,
            clientName: booking.fullName,
            clientEmail: booking.email,
            bookings: [booking]
          });
          return map;
        }

        existing.bookings.push(booking);
        return map;
      }, new Map<string, {
        address: string;
        city: string;
        propertyType: string;
        propertySize: string;
        clientName: string;
        clientEmail: string;
        bookings: typeof bookings;
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
              Properties
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
              Pregled objektov in lokacij čiščenja iz rezervacij.
            </p>
          </div>

          <div className="rounded-3xl bg-white px-6 py-4 text-right shadow-sm">
            <p className="text-sm font-bold text-[#5d716a]">Vseh objektov</p>
            <p className="mt-1 text-4xl font-extrabold">{properties.length}</p>
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <article key={`${property.address}-${property.city}`} className="rounded-[28px] bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#4d8dff]">
                {property.propertyType}
              </p>
              <h2 className="text-2xl font-extrabold">{property.address}</h2>
              <p className="mt-2 text-[#5d716a]">{property.city}</p>

              <div className="mt-5 rounded-2xl bg-[#f6f9ff] p-4">
                <p className="font-bold">{property.clientName}</p>
                <p className="mt-1 text-sm text-[#5d716a]">{property.clientEmail}</p>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm font-bold">
                <span>{property.propertySize}</span>
                <span>{property.bookings.length} terminov</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
