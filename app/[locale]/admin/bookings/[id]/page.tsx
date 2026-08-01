import {notFound} from "next/navigation";

import AdminBookingActions from "@/components/admin/AdminBookingActions";
import {prisma} from "@/lib/prisma";

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

type BookingDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingDetailsPage({
  params
}: BookingDetailsPageProps) {
  const {id} = await params;

  const booking = await prisma.booking.findUnique({
    where: {id}
  });

  if (!booking) {
    notFound();
  }

  const extras = safeParseExtras(booking.extras);

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-10 text-[#173e35]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <a href="/admin" className="text-sm font-bold text-[#2b8c73]">
              ← Nazaj na admin
            </a>
            <h1 className="mt-4 text-4xl font-bold">Podrobnosti rezervacije</h1>
            <p className="mt-2 text-[#5d716a]">
              Pregled vseh podatkov o tej rezervaciji.
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
              statusColors[booking.bookingStatus] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {statusLabels[booking.bookingStatus] ?? booking.bookingStatus}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6">
            <Card title="Podatki o stranki">
              <InfoRow label="Ime in priimek" value={booking.fullName} />
              <InfoRow label="E-posta" value={booking.email} />
              <InfoRow label="Telefon" value={booking.phone} />
              <InfoRow label="Naslov" value={booking.address} />
              <InfoRow label="Mesto" value={booking.city} />
            </Card>

            <Card title="Podatki o rezervaciji">
              <InfoRow label="Vrsta storitve" value={booking.propertyType} />
              <InfoRow label="Velikost" value={booking.propertySize} />
              <InfoRow
                label="Kopalnice"
                value={String(booking.bathrooms)}
              />
              <InfoRow label="Datum" value={booking.selectedDate} />
              <InfoRow label="Ura" value={booking.selectedTime} />
            </Card>

            <Card title="Dodatne storitve">
              {extras.length === 0 ? (
                <p className="text-[#5d716a]">Ni dodatnih storitev.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {extras.map((extra) => (
                    <span
                      key={extra}
                      className="rounded-full bg-[#e8f4ed] px-4 py-2 text-sm font-semibold text-[#173e35]"
                    >
                      {extra}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </section>

          <aside className="space-y-6">
            <Card title="Placilo">
              <InfoRow
                label="Znesek"
                value={`EUR ${booking.totalPrice}`}
              />
              <InfoRow
                label="Placilo"
                value={booking.paymentStatus}
              />
              <InfoRow
                label="Stripe session"
                value={booking.stripeSessionId ?? "Ni podatka"}
              />
            </Card>

            <Card title="Upravljanje">
              <AdminBookingActions
                bookingId={booking.id}
                currentStatus={booking.bookingStatus}
              />
            </Card>

            <Card title="Sistem">
              <InfoRow label="Booking ID" value={booking.id} />
              <InfoRow
                label="Ustvarjeno"
                value={formatDateTime(booking.createdAt)}
              />
            </Card>
          </aside>
        </div>
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
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <div className="border-b border-[#ece7dc] pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm font-semibold text-[#5d716a]">{label}</p>
      <p className="mt-1 text-base font-medium text-[#173e35] break-words">
        {value}
      </p>
    </div>
  );
}

function safeParseExtras(value: string) {
  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }

    return [];
  } catch {
    return [];
  }
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("sl-SI", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}