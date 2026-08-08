import {Suspense} from "react";

import BusinessInquiryForm from "@/components/BusinessInquiryForm";

const glassCleaningPrices = [
  {item: "Steklene pregrade", unit: "m²", price: "3,50 EUR"},
  {item: "Izložbena stekla", unit: "m²", price: "2,50 EUR"},
  {item: "Steklena vrata", unit: "kos", price: "6 EUR"},
  {item: "Ogledala", unit: "m²", price: "3,50 EUR"}
];

export default function SteklenePovrsinePage() {
  return (
    <main className="service-detail-page">
      <section className="deep-cleaning-section">
        <div className="deep-cleaning-copy">
          <a href="/" className="service-detail-back">
            ← Nazaj domov
          </a>

          <p className="eyebrow">
            <span /> STORITVE
          </p>

          <h2>
            Pranje steklenih <em>površin.</em>
          </h2>

          <p>
            Poskrbimo za čista steklena vrata, ogledala, pisarniške pregrade in
            izložbene površine. Storitev je primerna za pisarne, lokale, salone
            in poslovne prostore, kjer urejen prvi vtis veliko pomeni.
          </p>

          <div className="deep-minimum">
            Cena <strong>po ogledu</strong>
          </div>

          <a className="primary-button" href="#povprasevanje">
            Pošlji povpraševanje <span>→</span>
          </a>
        </div>

        <div className="deep-price-grid">
          {glassCleaningPrices.map((price) => (
            <article key={price.item}>
              <div>
                <h3>{price.item}</h3>
                <p>Cena na {price.unit}</p>
              </div>
              <strong>{price.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section id="povprasevanje" className="px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#2f6fe4]">
            POVPRAŠEVANJE
          </p>
          <h2 className="mb-4 text-4xl font-bold text-[#123b7a]">
            Pošljite povpraševanje za pranje steklenih površin.
          </h2>
          <p className="mb-8 leading-8 text-[#5d716a]">
            Vpišite svoje podatke in kratko sporočilo do 500 znakov.
          </p>

          <Suspense fallback={null}>
            <BusinessInquiryForm defaultService="Pranje steklenih površin" />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
