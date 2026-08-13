import {businessInquiryPrisma} from "@/lib/business-inquiry-prisma";
import type {BusinessInquiryRecord} from "@/lib/business-inquiry-prisma";
import DeleteInboxButton from "@/components/admin/DeleteInboxButton";
import PrioritySelector from "@/components/admin/PrioritySelector";
import SendCustomerEmailForm from "@/components/admin/SendCustomerEmailForm";
import {prisma} from "@/lib/prisma";

const priorityLabels: Record<string, string> = {
  LOW: "Nizka",
  NORMAL: "Normalna",
  HIGH: "Visoka"
};

const priorityStyles: Record<string, string> = {
  LOW: "bg-emerald-100 text-emerald-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-red-100 text-red-800"
};

type InboxBookingRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  propertyType: string;
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
  priority: string;
  bookingStatus: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("sl-SI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export default async function AdminInboxPage() {
  const [bookings, businessInquiries] = (await Promise.all([
    prisma.booking.findMany({
      where: {bookingStatus: "PENDING"},
      orderBy: {createdAt: "desc"}
    }),
    businessInquiryPrisma.businessInquiry.findMany({
      orderBy: {createdAt: "desc"}
    })
  ])) as [InboxBookingRecord[], BusinessInquiryRecord[]];

  const totalInbox = bookings.length + businessInquiries.length;

  return (
    <main className="px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d8dff]">
              CLEANIX ADMIN
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[#123b7a] sm:text-3xl">
              Inbox
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5d716a]">
              Nova povpraševanja in rezervacije, ki čakajo na odziv.
            </p>
          </div>

          <div className="min-w-[96px] rounded-2xl border border-[#dbe7fb] bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-[11px] font-bold text-[#5d716a]">Skupaj</p>
            <p className="mt-1 text-2xl font-bold text-[#123b7a]">{totalInbox}</p>
          </div>
        </div>

        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#123b7a]">
              Cleanix Business povpraševanja
            </h2>
            <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-bold text-[#123b7a]">
              {businessInquiries.length}
            </span>
          </div>

          {businessInquiries.length === 0 ? (
            <div className="rounded-2xl border border-[#dbe7fb] bg-white px-4 py-6 text-center text-sm font-medium text-[#123b7a] shadow-sm">
              Ni novih poslovnih povpraševanj.
            </div>
          ) : (
            <div className="grid gap-3">
              {businessInquiries.map((inquiry) => (
                <article
                  key={inquiry.id}
                  className="rounded-2xl border border-[#dbe7fb] bg-white p-4 shadow-sm"
                >
                  <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr_260px]">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2f6fe4]">
                        Poslovno povpraševanje
                      </p>
                      <h3 className="text-lg font-bold text-[#123b7a]">
                        {inquiry.fullName}
                      </h3>
                      <p className="mt-1 text-xs text-[#5d716a]">
                        {inquiry.email} · {inquiry.phone}
                      </p>
                      {inquiry.service ? (
                        <p className="mt-2 text-xs font-bold text-[#123b7a]">
                          Storitev: {inquiry.service}
                        </p>
                      ) : null}
                      <p className="mt-3 rounded-xl bg-[#f6f9ff] px-3 py-3 text-sm leading-6 text-[#123b7a]">
                        {inquiry.message}
                      </p>
                    </div>

                    <div className="grid gap-2 content-start">
                      <p className="text-xs font-medium text-[#5d716a]">
                        {formatDate(inquiry.createdAt)}
                      </p>
                      <span className="inline-flex w-fit rounded-full bg-[#eaf2ff] px-2.5 py-1 text-[11px] font-bold text-[#123b7a]">
                        {inquiry.status}
                      </span>
                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          priorityStyles[inquiry.priority] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {priorityLabels[inquiry.priority] ?? inquiry.priority}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      <div className="rounded-2xl border border-[#dbe7fb] bg-[#fbfdff] p-3">
                        <PrioritySelector
                          currentPriority={inquiry.priority}
                          endpoint={`/api/admin/business-inquiries/${inquiry.id}`}
                          compact
                        />
                      </div>

                      <SendCustomerEmailForm
                        to={inquiry.email}
                        replyTo={inquiry.email}
                        customerName={inquiry.fullName}
                        defaultSubject={`Cleanix odgovor - ${inquiry.service || "povpraševanje"}`}
                        templates={[
                          {
                            label: "Odgovor",
                            subject: "Cleanix - odgovor na povpraševanje",
                            text: `Pozdravljeni {customerName},\n\nhvala za vaše povpraševanje.\n\nVaše sporočilo smo prejeli in vam bomo čim prej odgovorili.\n\nLep pozdrav,\nCleanix`
                          },
                          {
                            label: "Ponudba",
                            subject: "Cleanix - ponudba",
                            text: `Pozdravljeni {customerName},\n\npošiljamo vam našo ponudbo glede vašega povpraševanja.\n\nStoritev: ${inquiry.service || "ni izbrano"}\n\nČe želite, lahko skupaj uskladimo termin.\n\nLep pozdrav,\nCleanix`
                          },
                          {
                            label: "Dodatno",
                            subject: "Cleanix - dodatne informacije",
                            text: `Pozdravljeni {customerName},\n\nprosimo, odgovorite nam še z nekaj dodatnimi informacijami, da vam pripravimo najboljšo rešitev.\n\nLep pozdrav,\nCleanix`
                          }
                        ]}
                      />

                      <div className="flex justify-end">
                        <DeleteInboxButton id={inquiry.id} type="business-inquiry" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#123b7a]">
              Rezervacije, ki čakajo na potrditev
            </h2>
            <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-bold text-[#123b7a]">
              {bookings.length}
            </span>
          </div>

          {bookings.length === 0 ? (
            <section className="rounded-2xl border border-[#dbe7fb] bg-white px-4 py-6 text-center shadow-sm">
              <h3 className="text-base font-bold text-[#123b7a]">Ni novih rezervacij</h3>
              <p className="mt-1 text-sm text-[#5d716a]">
                Trenutno ni rezervacij, ki čakajo na potrditev.
              </p>
            </section>
          ) : (
            <section className="grid gap-3">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-[#dbe7fb] bg-white p-4 shadow-sm"
                >
                  <div className="grid gap-3 lg:grid-cols-[1fr_1fr_280px]">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-600">
                        Nova rezervacija
                      </p>
                      <h3 className="text-lg font-bold text-[#123b7a]">
                        {booking.fullName}
                      </h3>
                      <p className="mt-1 text-xs text-[#5d716a]">
                        {booking.email} · {booking.phone}
                      </p>
                    </div>

                    <div className="grid gap-1 content-start">
                      <p className="text-sm font-bold text-[#123b7a]">
                        {booking.selectedDate} ob {booking.selectedTime}
                      </p>
                      <p className="text-sm text-[#5d716a]">
                        {booking.city}, {booking.address}
                      </p>
                      <p className="text-sm text-[#5d716a]">
                        {booking.propertyType} · EUR {booking.totalPrice}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <div className="flex justify-start">
                        <a
                          href={`/sl/admin/bookings/${booking.id}`}
                          className="admin-blue-button px-4 py-2 text-xs"
                        >
                          Odpri
                        </a>
                      </div>

                      <div className="rounded-2xl border border-[#dbe7fb] bg-[#fbfdff] p-3">
                        <PrioritySelector
                          currentPriority={booking.priority}
                          endpoint={`/api/admin/bookings/${booking.id}`}
                          compact
                        />
                      </div>

                      <SendCustomerEmailForm
                        to={booking.email}
                        replyTo={booking.email}
                        customerName={booking.fullName}
                        defaultSubject={`Cleanix odgovor - ${booking.selectedDate}`}
                        templates={[
                          {
                            label: "Potrditev",
                            subject: "Cleanix - potrditev termina",
                            text: `Pozdravljeni {customerName},\n\nvaš termin je potrjen.\n\nDatum: ${booking.selectedDate}\nUra: ${booking.selectedTime}\nNaslov: ${booking.city}, ${booking.address}\n\nLep pozdrav,\nCleanix`
                          },
                          {
                            label: "Prestavi",
                            subject: "Cleanix - prestavitev termina",
                            text: `Pozdravljeni {customerName},\n\nprosimo, da nam sporočite nov predlog termina za prestavitev.\n\nLep pozdrav,\nCleanix`
                          },
                          {
                            label: "Ponudba",
                            subject: "Cleanix - ponudba",
                            text: `Pozdravljeni {customerName},\n\npošiljamo vam ponudbo za rezervacijo.\n\nStoritev: ${booking.propertyType}\nCena: EUR ${booking.totalPrice}\nDatum: ${booking.selectedDate}\nUra: ${booking.selectedTime}\n\nLep pozdrav,\nCleanix`
                          }
                        ]}
                      />

                      <div className="flex justify-end">
                        <DeleteInboxButton id={booking.id} type="booking" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
