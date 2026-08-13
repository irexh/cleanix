import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import {prisma} from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  PENDING: "Čaka",
  CONFIRMED: "Prevzeto",
  IN_PROGRESS: "Na poti",
  COMPLETED: "Opravljeno",
  CANCELLED: "Preklicano"
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-cyan-100 text-cyan-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800"
};

const quickLinks = [
  {href: "/sl/admin/bookings", label: "Termini", hint: "Pregled in upravljanje terminov"},
  {href: "/sl/admin/inbox", label: "Inbox", hint: "Potrditve in nova povpraševanja"},
  {href: "/sl/admin/services", label: "Cene & akcije", hint: "Urejanje cen in akcij"},
  {href: "/sl/admin/content", label: "Vsebine", hint: "Teksti brez VS Code"},
  {href: "/sl/admin/gallery", label: "Slike", hint: "Homepage in galerija"},
  {href: "/sl/admin/employees", label: "Zaposleni", hint: "Ekipa in logini"},
  {href: "/sl/admin/calendar", label: "Koledar", hint: "Dnevni pregled terminov"},
  {href: "/sl/admin/clients", label: "Stranke", hint: "CRM in zgodovina"},
  {href: "/sl/admin/companies", label: "Podjetja", hint: "Poslovni CRM"},
  {href: "/sl/admin/offers", label: "Ponudbe", hint: "Poslovne ponudbe"},
  {href: "/sl/admin/settings", label: "Nastavitve", hint: "Sistemske nastavitve"}
];

type BookingSummary = {
  id: string;
  fullName: string;
  email: string;
  city: string;
  selectedDate: string;
  selectedTime: string;
  bookingStatus: string;
  totalPrice: number;
  propertyType: string;
  propertySize: string;
  employee: {name: string} | null;
};

type InquirySummary = {
  id: string;
  fullName: string;
  email: string;
  service: string | null;
  status: string;
  priority: string;
  createdAt: Date;
};

export default async function AdminPage() {
  const [
    bookings,
    businessInquiries,
    employeesCount,
    activeEmployeesCount,
    servicePricesCount,
    activeSalesCount,
    announcementsCount,
    galleryCount,
    contentCount,
    customerUsersCount
  ] = await Promise.all([
    prisma.booking.findMany({
      orderBy: {createdAt: "desc"},
      select: {
        id: true,
        fullName: true,
        email: true,
        city: true,
        selectedDate: true,
        selectedTime: true,
        bookingStatus: true,
        totalPrice: true,
        propertyType: true,
        propertySize: true,
        employee: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.businessInquiry.findMany({
      orderBy: {createdAt: "desc"},
      select: {
        id: true,
        fullName: true,
        email: true,
        service: true,
        status: true,
        priority: true,
        createdAt: true
      }
    }),
    prisma.employee.count(),
    prisma.employee.count({where: {isActive: true}}),
    prisma.servicePrice.count(),
    prisma.servicePrice.count({where: {isActive: true, salePrice: {not: null}}}),
    prisma.announcement.count(),
    prisma.galleryImage.count({where: {isActive: true}}),
    prisma.siteContent.count(),
    prisma.user.count({where: {role: "CUSTOMER"}})
  ]);

  const typedBookings = bookings as BookingSummary[];
  const typedInquiries = businessInquiries as InquirySummary[];
  const uniqueClients = new Set(
    typedBookings.map((booking) => booking.email.toLowerCase())
  );
  const activeBookings = typedBookings.filter(
    (booking) => booking.bookingStatus !== "CANCELLED" && booking.bookingStatus !== "COMPLETED"
  );
  const pendingInbox = typedBookings.filter((booking) => booking.bookingStatus === "PENDING").length +
    typedInquiries.filter((inquiry) => inquiry.status === "NEW").length;
  const businessBookings = typedBookings.filter((booking) =>
    booking.propertyType.toLowerCase().includes("poslov")
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-4 py-4 text-[#123b7a] sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#4d8dff]">
              CLEANIX ADMIN
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Nadzorni center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#5d716a]">
              Vse pomembno na enem mestu: cene, akcije, vsebine, slike, zaposleni,
              termini in CRM za stranke ter podjetja.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/sl/admin/inbox"
              className="rounded-full bg-[#2f6fe4] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#123b7a]"
            >
              Inbox
            </a>
            <a
              href="/"
              className="rounded-full border border-[#123b7a] px-3 py-2 text-xs font-bold text-[#123b7a] transition hover:bg-[#123b7a] hover:text-white"
            >
              Spletna stran
            </a>
            <AdminLogoutButton />
          </div>
        </div>

        <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          <StatCard label="Rezervacije" value={String(typedBookings.length)} />
          <StatCard label="Aktivne" value={String(activeBookings.length)} />
          <StatCard label="Inbox" value={String(pendingInbox)} />
          <StatCard label="Stranke" value={String(uniqueClients.size)} />
          <StatCard label="Podjetja" value={String(typedInquiries.length)} />
          <StatCard label="Zaposleni" value={String(employeesCount)} />
          <StatCard label="Cene" value={String(servicePricesCount)} />
          <StatCard label="Akcije" value={String(activeSalesCount)} />
        </section>

        <section className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-[18px] border border-[#dbe7fb] bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#4d8dff]"
            >
              <p className="text-sm font-bold text-[#123b7a]">{link.label}</p>
              <p className="mt-1 text-[11px] leading-4 text-[#5d716a]">
                {link.hint}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-[1.25fr_0.95fr]">
          <Card title="Najnovejši termini" badge={String(typedBookings.length)}>
            {typedBookings.length === 0 ? (
              <EmptyState text="Ni rezervacij." />
            ) : (
              <div className="grid gap-2">
                {typedBookings.slice(0, 4).map((booking) => (
                  <article
                    key={booking.id}
                    className="grid gap-2 rounded-[16px] border border-[#dbe7fb] bg-[#f8fbff] p-3 sm:grid-cols-[1.15fr_1fr_0.75fr]"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                        Stranka
                      </p>
                      <h3 className="mt-1 text-sm font-bold text-[#123b7a]">
                        {booking.fullName}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#5d716a]">
                        {booking.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                        Termin
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#123b7a]">
                        {booking.selectedDate} ob {booking.selectedTime}
                      </p>
                      <p className="mt-1 text-[11px] text-[#5d716a]">
                        {booking.city} · {booking.propertyType}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          statusStyles[booking.bookingStatus] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusLabels[booking.bookingStatus] ?? booking.bookingStatus}
                      </span>
                      <p className="text-sm font-bold text-[#123b7a]">
                        EUR {booking.totalPrice}
                      </p>
                      <a
                        href={`/sl/admin/bookings/${booking.id}`}
                        className="rounded-full border border-[#123b7a] px-3 py-1.5 text-[11px] font-bold text-[#123b7a] transition hover:bg-[#123b7a] hover:text-white"
                      >
                        Odpri
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>

          <Card title="CRM stranke" badge={`${uniqueClients.size}`}>
            {typedBookings.length === 0 ? (
              <EmptyState text="Še ni strank." />
            ) : (
              <div className="grid gap-2">
                {Array.from(
                  typedBookings.reduce((map, booking) => {
                    const key = booking.email.toLowerCase();
                    const current = map.get(key);

                    if (!current) {
                      map.set(key, {
                        name: booking.fullName,
                        email: booking.email,
                        bookings: 1,
                        lastBooking: `${booking.selectedDate} ob ${booking.selectedTime}`
                      });
                    } else {
                      current.bookings += 1;
                    }

                    return map;
                  }, new Map<string, {name: string; email: string; bookings: number; lastBooking: string}>())
                    .values()
                )
                  .slice(0, 4)
                  .map((client) => (
                    <div
                      key={client.email}
                      className="rounded-[16px] border border-[#dbe7fb] bg-[#f8fbff] px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#123b7a]">{client.name}</p>
                          <p className="mt-1 text-[11px] text-[#5d716a]">{client.email}</p>
                        </div>
                        <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-[10px] font-bold text-[#2f6fe4]">
                          {client.bookings}x
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          <Card title="Podjetja" badge={`${typedInquiries.length}`}>
            {typedInquiries.length === 0 ? (
              <EmptyState text="Še ni podjetij." />
            ) : (
              <div className="grid gap-2">
                {typedInquiries.slice(0, 4).map((inquiry) => (
                  <article
                    key={inquiry.id}
                    className="rounded-[16px] border border-[#dbe7fb] bg-[#f8fbff] px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#123b7a]">
                          {inquiry.fullName}
                        </p>
                        <p className="mt-1 text-[11px] text-[#5d716a]">
                          {inquiry.email}
                        </p>
                        <p className="mt-1 text-[11px] text-[#5d716a]">
                          {inquiry.service || "Brez storitve"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            inquiry.priority === "HIGH"
                              ? "bg-red-100 text-red-800"
                              : inquiry.priority === "LOW"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {priorityLabel(inquiry.priority)}
                        </span>
                        <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-[10px] font-bold text-[#2f6fe4]">
                          {inquiry.status}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </section>

        <section className="mt-4 grid gap-3 xl:grid-cols-[1fr_1fr]">
          <Card title="Vsebina / slike / zaposlenci" badge="CMS">
            <div className="grid gap-2 sm:grid-cols-2">
              <MiniLink href="/sl/admin/content" label="Vsebine" value={String(contentCount)} />
              <MiniLink href="/sl/admin/gallery" label="Slike" value={String(galleryCount)} />
              <MiniLink href="/sl/admin/employees" label="Zaposleni" value={String(activeEmployeesCount)} />
              <MiniLink href="/sl/admin/services" label="Cene" value={String(servicePricesCount)} />
            </div>
          </Card>

          <Card title="Hitri CRM povzetek" badge="CRM">
            <div className="grid gap-2">
              <MiniRow label="Stranke" value={String(uniqueClients.size)} />
              <MiniRow label="Podjetja" value={String(typedInquiries.length)} />
              <MiniRow label="Poslovne rezervacije" value={String(businessBookings)} />
              <MiniRow label="Zadnje obvestilo" value={String(announcementsCount)} />
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

function StatCard({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-[18px] bg-white px-3 py-3 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-[#123b7a]">{value}</p>
    </div>
  );
}

function Card({
  title,
  badge,
  children
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-normal leading-tight text-[#123b7a]">{title}</h2>
        {badge ? (
          <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-[10px] font-bold text-[#2f6fe4]">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function MiniLink({href, label, value}: {href: string; label: string; value: string}) {
  return (
    <a
      href={href}
      className="rounded-[16px] border border-[#dbe7fb] bg-[#f8fbff] px-3 py-3 transition hover:border-[#4d8dff]"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-[#123b7a]">{value}</p>
    </a>
  );
}

function MiniRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-[#dbe7fb] bg-[#f8fbff] px-3 py-2.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5d716a]">
        {label}
      </span>
      <span className="text-sm font-bold text-[#123b7a]">{value}</span>
    </div>
  );
}

function EmptyState({text}: {text: string}) {
  return (
    <div className="rounded-[16px] bg-[#f8fbff] px-3 py-3 text-center text-xs text-[#5d716a]">
      {text}
    </div>
  );
}

function priorityLabel(value: string) {
  if (value === "HIGH") return "Visoka";
  if (value === "LOW") return "Nizka";
  return "Normalna";
}
