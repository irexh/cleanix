import {
  createAnnouncementAction,
  deleteAnnouncementAction,
  deleteServicePriceAction,
  saveServicePriceAction,
  toggleServicePriceAction
} from "@/app/[locale]/admin/services/actions";
import ServiceSaleActions from "@/components/admin/ServiceSaleActions";
import ServiceSaleForm from "@/components/admin/ServiceSaleForm";
import {ensureDefaultServicePrices} from "@/lib/admin-pricing";
import {
  deepCleaningMinimumOrder,
  deepCleaningPrices
} from "@/lib/deep-cleaning-prices";
import {announcementPrisma} from "@/lib/announcement-prisma";
import {servicePricePrisma} from "@/lib/service-price-prisma";

const sizeOptions = [
  "Do 40 m²",
  "41–60 m²",
  "61–80 m²",
  "81–100 m²",
  "101–150 m²",
  "151 m² ali več"
];

const frequencyOptions = [
  {value: "ENKRATNO", label: "1x enkratno"},
  {value: "NA_DVA_TEDNA", label: "1x na dva tedna"},
  {value: "MESECNO", label: "1x na mesec"}
];

const durationOptions = [
  {value: "", label: "Brez trajanja"},
  {value: "3 mesece", label: "3 mesece"},
  {value: "6 mesecev", label: "6 mesecev"},
  {value: "12 mesecev", label: "12 mesecev"}
];

const frequencyLabels = Object.fromEntries(
  [
    ...frequencyOptions.map((option) => [option.value, option.label]),
    ["PRVI_3_MESECI", "Prvi 3 meseci"]
  ]
);

function splitFrequency(value: string) {
  const [frequency, duration = ""] = value.split("__");

  return {
    frequencyLabel: frequencyLabels[frequency] ?? frequency,
    duration
  };
}

export default async function AdminServicesPage() {
  await ensureDefaultServicePrices();

  const prices = await servicePricePrisma.servicePrice.findMany({
    where: {salePrice: {not: null}},
    orderBy: {updatedAt: "desc"}
  });
  const announcements = await announcementPrisma.announcement.findMany({
    where: {isActive: true},
    orderBy: {createdAt: "desc"}
  });

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Services & Akcije
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Tukaj nastaviš akcijsko ceno za izbrano velikost, pogostost in trajanje.
          Cena je vedno cena na obisk.
        </p>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">Novice, risi in reklame</h2>
          <p className="mt-2 text-sm text-[#5d716a]">
            Objavi kratek tekst na spletni strani. Besedilo je omejeno na 500 znakov.
          </p>

          <form action={createAnnouncementAction} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              Naslov
              <input
                name="title"
                maxLength={80}
                required
                placeholder="npr. Nova akcija za Ljubljana Center"
                className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Kratek opis
              <textarea
                name="body"
                maxLength={500}
                required
                rows={5}
                placeholder="Napisi risi, obvestilo ali reklamo do 500 znakov."
                className="resize-none rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#4d8dff]"
              />
            </label>

            <button
              type="submit"
              className="w-fit rounded-full bg-[#2f6fe4] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#123b7a]"
            >
              Objavi
            </button>
          </form>

          {announcements.length > 0 ? (
            <div className="mt-7 grid gap-4">
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="grid gap-4 rounded-2xl border border-[#dbe7fb] bg-[#f6f9ff] p-5 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <h3 className="text-xl font-extrabold text-[#123b7a]">
                      {announcement.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#5d716a]">
                      {announcement.body}
                    </p>
                  </div>

                  <form action={deleteAnnouncementAction}>
                    <input type="hidden" name="id" value={announcement.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-200 px-5 py-2 text-sm font-extrabold text-red-700 transition hover:bg-red-50"
                    >
                      Fshije
                    </button>
                  </form>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">Dodaj ali uredi akcijo</h2>
          <p className="mt-2 text-sm text-[#5d716a]">
            Če izbereš isto velikost, pogostost in trajanje, se obstoječa akcija
            posodobi.
          </p>

          <ServiceSaleForm
            action={saveServicePriceAction}
            sizeOptions={sizeOptions}
            frequencyOptions={frequencyOptions}
            durationOptions={durationOptions}
          />
        </section>

        <section className="mt-8 rounded-[32px] bg-[#123b7a] p-6 text-white shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">Cleanix Business akcija</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d8e5ff]">
            To objavi akcijo na strani Cleanix Business. Če ni aktivna ali ni
            znotraj datuma, se na spletni strani ne prikaže.
          </p>

          <form
            action={saveServicePriceAction}
            className="mt-7 grid gap-5 lg:grid-cols-3"
          >
            <input type="hidden" name="serviceKey" value="BUSINESS_CONTRACT" />
            <input type="hidden" name="serviceName" value="Cleanix Business" />
            <input type="hidden" name="propertyType" value="Podjetje" />
            <input type="hidden" name="sizeRange" value="12-mesečna pogodba" />
            <input type="hidden" name="frequency" value="PRVI_3_MESECI" />
            <input type="hidden" name="duration" value="" />
            <input type="hidden" name="regularPrice" value="100" />

            <label className="grid gap-2 text-sm font-bold">
              Popust v %
              <input
                name="salePrice"
                type="number"
                min="1"
                max="100"
                required
                placeholder="npr. 20"
                className="rounded-xl border border-white/20 bg-white px-4 py-3 text-[#123b7a] outline-none focus:border-[#4d8dff]"
              />
            </label>

            <div className="rounded-xl bg-white/10 px-4 py-3 text-sm leading-6 lg:mt-7">
              <strong>Primer:</strong> če vpišeš 20, se na strani prikaže 20%
              popust za prve 3 mesece.
            </div>

            <label className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold lg:mt-7">
              <input name="isActive" type="checkbox" defaultChecked />
              Aktivno
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Akcija od
              <input
                name="saleStartsAt"
                type="date"
                className="rounded-xl border border-white/20 bg-white px-4 py-3 text-[#123b7a] outline-none focus:border-[#4d8dff]"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Akcija do
              <input
                name="saleEndsAt"
                type="date"
                className="rounded-xl border border-white/20 bg-white px-4 py-3 text-[#123b7a] outline-none focus:border-[#4d8dff]"
              />
            </label>

            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#123b7a] transition hover:bg-[#eaf2ff] lg:mt-7"
            >
              Objavi Business akcijo
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">Shranjene akcije</h2>

          {prices.length === 0 ? (
            <p className="mt-4 text-[#5d716a]">Trenutno ni shranjenih akcij.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {prices.map((price) => {
                const {frequencyLabel, duration} = splitFrequency(price.frequency);

                return (
                  <article
                    key={price.id}
                  className="grid gap-4 rounded-2xl border border-[#dbe7fb] bg-[#f6f9ff] p-5 xl:grid-cols-[1.2fr_1fr_1fr_220px]"
                  >
                    <div>
                      <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#4d8dff]">
                        {price.serviceName}
                      </p>
                      <h3 className="text-xl font-extrabold">{price.sizeRange}</h3>
                      <p className="mt-1 text-sm text-[#5d716a]">
                        {frequencyLabel}
                        {duration ? ` · ${duration}` : ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#5d716a]">
                        {price.serviceKey === "BUSINESS_CONTRACT" ? "Popust" : "Cena"}
                      </p>
                      <p className="mt-1 font-extrabold">
                        {price.serviceKey === "BUSINESS_CONTRACT"
                          ? `${price.salePrice ?? 0}% popust`
                          : `Redna €${price.regularPrice}${
                              price.salePrice ? ` · Akcija €${price.salePrice}` : ""
                            }`}
                      </p>
                    </div>

                  <div>
                    <p className="text-sm font-bold text-[#5d716a]">Veljavnost</p>
                      <p className="mt-1 font-extrabold">
                        {price.saleStartsAt || "—"} do {price.saleEndsAt || "—"}
                      </p>
                      <p className="mt-1 text-sm font-bold">
                      {price.isActive ? "Aktivno" : "Skrito"}
                    </p>
                  </div>

                  <ServiceSaleActions
                    id={price.id}
                    isActive={price.isActive}
                    toggleAction={toggleServicePriceAction}
                    deleteAction={deleteServicePriceAction}
                  />
                </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#4d8dff]">
                GLOBINSKO ČIŠČENJE
              </p>
              <h2 className="text-2xl font-extrabold">
                Cenik oblazinjenega pohištva
              </h2>
              <p className="mt-2 text-sm text-[#5d716a]">
                Cene so informativne in veljajo kot osnova za prihodnji modul
                naročanja globinskega čiščenja.
              </p>
            </div>

            <div className="rounded-2xl bg-[#eaf2ff] px-5 py-4 text-right">
              <p className="text-sm font-bold text-[#5d716a]">Minimalno naročilo</p>
              <p className="text-2xl font-extrabold">€{deepCleaningMinimumOrder}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deepCleaningPrices.map((price) => (
              <article
                key={price.item}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#dbe7fb] bg-[#f6f9ff] p-5"
              >
                <div>
                  <h3 className="font-extrabold">{price.item}</h3>
                  <p className="mt-1 text-sm text-[#5d716a]">Cena na {price.unit}</p>
                </div>

                <p className="text-2xl font-extrabold">€{price.price}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
