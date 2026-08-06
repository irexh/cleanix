import Image from "next/image";

import BusinessInquiryForm from "@/components/BusinessInquiryForm";
import {getActiveBusinessSale} from "@/lib/sale-pricing";
import {getSiteContentMap} from "@/lib/site-content";

export const dynamic = "force-dynamic";

const businessServices = [
  "Redno čiščenje pisarn",
  "Čiščenje lokalov in salonov",
  "Jutranje ali večerno čiščenje",
  "Čiščenje skupnih prostorov",
  "Prilagojeni termini za podjetja"
];

const reasons = [
  {
    title: "Zanesljiv prihod",
    text: "Dogovorjen termin spoštujemo natančno in brez zapletov."
  },
  {
    title: "Prilagodljiv urnik",
    text: "Čiščenje prilagodimo vašemu delovnemu času in ritmu podjetja."
  },
  {
    title: "Diskretnost",
    text: "V poslovnih prostorih delamo mirno, profesionalno in spoštljivo."
  },
  {
    title: "Dolgoročno sodelovanje",
    text: "Gradimo stabilna partnerstva za redno in brezskrbno vzdrževanje."
  }
];

export default async function BusinessPage() {
  const activeBusinessSale = await getActiveBusinessSale().catch(() => null);
  const content = await getSiteContentMap();

  return (
    <main className="min-h-screen bg-[#f6f9ff] text-[#123b7a]">
      <section className="hidden">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[36px] bg-white p-8 shadow-sm sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">
              <span /> POVPRAŠEVANJE
            </p>
            <h2 className="mb-5 text-4xl font-bold">
              Povejte nam, kaj potrebuje vaš poslovni prostor.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[#5d716a]">
              Vnesite svoje podatke in kratko sporočilo. Kontaktirali vas bomo
              za dogovor o terminu, obsegu dela in pripravo ponudbe.
            </p>
          </div>

          <BusinessInquiryForm />
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow hero-animate-kicker">
            <span /> {content.business_hero_kicker}
          </p>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h1 className="hero-animate-title mb-6 max-w-3xl text-6xl font-bold leading-none">
                {content.business_hero_title}
              </h1>

              <p className="hero-animate-text max-w-2xl text-xl leading-8 text-[#5d716a]">
                {content.business_hero_text}
              </p>

              <div className="hero-animate-actions mt-8 flex flex-wrap gap-4">
                <a
                  href="#business-povprasevanje"
                  className="rounded-full bg-[#2f6fe4] px-6 py-3 font-bold !text-white transition hover:bg-[#17498f] hover:!text-white"
                >
                  Pošljite povpraševanje
                </a>

                <a
                  href="/"
                  className="rounded-full border border-[#123b7a] px-6 py-3 font-bold text-[#123b7a] transition hover:bg-[#17498f] hover:!text-white"
                >
                  Nazaj domov
                </a>
              </div>
            </div>

            <div className="business-hero-visual overflow-hidden rounded-[36px] bg-white shadow-xl">
              <Image
                src={content.business_hero_image}
                alt="Cleanix Business - čisti in sodobni poslovni prostori"
                width={1734}
                height={1156}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
              Zanesljivost
            </p>
            <h3 className="mb-2 text-2xl font-bold">Točni in dosledni</h3>
            <p className="leading-7 text-[#5d716a]">
              Poslovni prostori potrebujejo ekipo, na katero se lahko zanesete
              brez dodatnega usklajevanja in zapletov.
            </p>
          </div>

          <div className="rounded-[28px] bg-[#eaf2ff] p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
              Fleksibilnost
            </p>
            <h3 className="mb-2 text-2xl font-bold">Čiščenje po vašem ritmu</h3>
            <p className="leading-7 text-[#5d716a]">
              Jutranji, večerni ali dogovorjeni termini - storitev prilagodimo
              načinu dela vašega podjetja.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
              Vtis
            </p>
            <h3 className="mb-2 text-2xl font-bold">Čist prostor, boljši občutek</h3>
            <p className="leading-7 text-[#5d716a]">
              Urejen prostor vpliva na zaposlene, stranke in celoten vtis vašega
              podjetja.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[36px] bg-white p-8 shadow-sm sm:p-10">
          <p className="eyebrow">
            <span /> KAJ PONUJAMO
          </p>

          <h2 className="mb-8 text-4xl font-bold">
            Storitve za urejeno in brezhibno poslovno okolje.
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {businessServices.map((service) => (
              <div
                key={service}
                className="rounded-2xl bg-[#eaf2ff] px-5 py-4 font-semibold text-[#123b7a]"
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[36px] bg-[#123b7a] p-8 text-white shadow-sm sm:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#c8dbff]">
            ZAKAJ NAS
          </p>

          <h2 className="mb-8 text-4xl font-bold">
            Zanesljiv partner za čiste in urejene poslovne prostore.
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason.title} className="rounded-3xl bg-white/10 p-6">
                <h3 className="mb-3 text-xl font-bold">{reason.title}</h3>
                <p className="leading-7 text-[#d8e5ff]">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className={`mx-auto grid max-w-7xl gap-6 ${activeBusinessSale ? "lg:grid-cols-2" : ""}`}>
          {activeBusinessSale ? (
            <div className="rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
                AKCIJA ZA NOVA PODJETJA
              </p>
              <h2 className="mb-4 text-4xl font-bold">
                Prvi 3 meseci z {activeBusinessSale.salePrice}% popustom.
              </h2>
              <p className="max-w-xl leading-8 text-[#5d716a]">
                Ob sklenitvi 12-mesečnega sodelovanja nudimo prve 3 mesece po
                posebni akcijski ceni. Popust se obračuna glede na dogovorjeno
                redno ceno za vaš poslovni prostor.
              </p>
              <p className="mt-4 max-w-xl rounded-2xl bg-[#eaf2ff] p-4 text-sm font-semibold leading-7 text-[#123b7a]">
                V primeru predčasne prekinitve pogodbe se popust za prve 3 mesece
                obračuna naknadno.
              </p>
            </div>
          ) : null}

          <div className="rounded-[32px] bg-[#eaf2ff] p-8 shadow-sm sm:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#5d716a]">
              IZKUŠNJE
            </p>
            <h2 className="mb-4 text-4xl font-bold">
              Resnost, natančnost in dolgoročno sodelovanje.
            </h2>
            <p className="leading-8 text-[#5d716a]">
              Poslovni prostori zahtevajo zanesljivost, doslednost in dober
              občutek za organizacijo. Naš cilj ni enkraten obisk, ampak
              partnerstvo, ki podjetju olajša vsakdan.
            </p>
          </div>
        </div>
      </section>

      <section id="business-povprasevanje" className="px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[36px] bg-white p-8 shadow-sm sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">
              <span /> POVPRAŠEVANJE
            </p>
            <h2 className="mb-5 text-4xl font-bold">
              Povejte nam, kaj potrebuje vaš poslovni prostor.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[#5d716a]">
              Vnesite svoje podatke in kratko sporočilo. Kontaktirali vas bomo
              za dogovor o terminu, obsegu dela in pripravo ponudbe.
            </p>
          </div>

          <BusinessInquiryForm />
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] bg-[#2f6fe4] p-10 text-center text-white shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#dce8ff]">
            CLEANIX BUSINESS
          </p>
          <h2 className="mx-auto max-w-3xl text-4xl font-bold">
            Potrebujete zanesljivo čiščenje za svoje podjetje?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#eaf2ff]">
            Pošljite povpraševanje in pripravili bomo rešitev, prilagojeno
            vašemu prostoru, urniku in načinu dela.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#business-povprasevanje"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#2f6fe4] px-6 py-3 font-bold !text-white no-underline transition hover:bg-[#17498f] hover:!text-white"
            >
              Kontaktirajte nas
            </a>

            <a
              href="/"
              className="inline-flex min-w-[170px] items-center justify-center rounded-full border border-[#123b7a] bg-white px-6 py-3 font-bold !text-[#123b7a] no-underline transition hover:bg-[#17498f] hover:!text-white"
            >
              Nazaj domov
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
