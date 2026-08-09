import {businessInquiryPrisma} from "@/lib/business-inquiry-prisma";
import PrioritySelector from "@/components/admin/PrioritySelector";
import SendCustomerEmailForm from "@/components/admin/SendCustomerEmailForm";
import {prisma} from "@/lib/prisma";
import DeleteInboxButton from "@/components/admin/DeleteInboxButton";

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
  const [bookings, businessInquiries] = await Promise.all([
    prisma.booking.findMany({
      where: {bookingStatus: "PENDING"},
      orderBy: {createdAt: "desc"}
    }),
    businessInquiryPrisma.businessInquiry.findMany({
      orderBy: {createdAt: "desc"}
    })
  ]);

  const totalInbox = bookings.length + businessInquiries.length;

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
              Nova poslovna povpraševanja in rezervacije, ki čakajo na potrditev.
            </p>
          </div>

          <div className="rounded-3xl bg-white px-6 py-4 text-right shadow-sm">
            <p className="text-sm font-bold text-[#5d716a]">Skupaj v inboxu</p>
            <p className="mt-1 text-4xl font-extrabold">{totalInbox}</p>
          </div>
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-[#123b7a]">
              Cleanix Business povpraševanja
            </h2>
            <span className="rounded-full bg-[#eaf2ff] px-4 py-2 text-sm font-bold text-[#123b7a]">
              {businessInquiries.length}
            </span>
          </div>

          {businessInquiries.length === 0 ? (
            <div className="rounded-[28px] bg-white p-8 text-center shadow-sm">
              <p className="font-bold">Ni novih poslovnih povpraševanj.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {businessInquiries.map((inquiry) => (
                <article
                  key={inquiry.id}
                  className="rounded-[28px] bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#2f6fe4]">
                        Poslovno povpraševanje
                      </p>
                      <h3 className="text-2xl font-extrabold text-[#123b7a]">
                        {inquiry.fullName}
                      </h3>
                      <p className="mt-2 text-sm text-[#5d716a]">
                        {inquiry.email} · {inquiry.phone}
                      </p>
                      {inquiry.service ? (
                        <p className="mt-2 text-sm font-bold text-[#123b7a]">
                          Storitev: {inquiry.service}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-right text-sm text-[#5d716a]">
                      <p>{formatDate(inquiry.createdAt)}</p>
                      <p className="mt-2 inline-flex rounded-full bg-[#eaf2ff] px-3 py-1 font-bold text-[#123b7a]">
                        {inquiry.status}
                      </p>
                      <p
                        className={`mt-2 inline-flex rounded-full px-3 py-1 font-bold ${
                          priorityStyles[inquiry.priority] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {priorityLabels[inquiry.priority] ?? inquiry.priority}
                      </p>
                    </div>
                  </div>

                  <p className="rounded-2xl bg-[#f6f9ff] p-4 leading-7 text-[#123b7a]">
                    {inquiry.message}
                  </p>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_420px]">
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

                    <div className="space-y-3 rounded-3xl border border-[#dbe7fb] bg-white p-6">
                      <PrioritySelector
                        currentPriority={inquiry.priority}
                        endpoint={`/api/admin/business-inquiries/${inquiry.id}`}
                        compact
                      />
                      <div className="flex justify-end">
                        <DeleteInboxButton
                          id={inquiry.id}
                          type="business-inquiry"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-[#123b7a]">
              Rezervacije čakajo na potrditev
            </h2>
            <span className="rounded-full bg-[#eaf2ff] px-4 py-2 text-sm font-bold text-[#123b7a]">
              {bookings.length}
            </span>
          </div>

          {bookings.length === 0 ? (
            <section className="rounded-[32px] bg-white p-10 text-center shadow-sm">
              <h3 className="text-2xl font-bold">Ni novih rezervacij</h3>
              <p className="mt-3 text-[#5d716a]">
                Trenutno ni rezervacij, ki čakajo na potrditev.
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
                      Nova rezervacija
                    </p>
                    <h3 className="text-2xl font-extrabold">{booking.fullName}</h3>
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

                  <div className="space-y-3">
                    <a
                      href={`/sl/admin/bookings/${booking.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-[#2f6fe4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#215ac0]"
                    >
                      Odpri
                    </a>
                    <PrioritySelector
                      currentPriority={booking.priority}
                      endpoint={`/api/admin/bookings/${booking.id}`}
                      compact
                    />
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
                </article>
              ))}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
