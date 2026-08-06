import {Suspense} from "react";

import BusinessInquiryForm from "@/components/BusinessInquiryForm";
import {
  deepCleaningMinimumOrder,
  deepCleaningPrices
} from "@/lib/deep-cleaning-prices";

export default function GlobinskoCiscenjePage() {
  return (
    <main className="service-detail-page">
      <section className="deep-cleaning-section">
        <div className="deep-cleaning-copy">
          <a href="/" className="service-detail-back">
            ← Nazaj domov
          </a>

          <p className="eyebrow">
            <span /> GLOBINSKO ČIŠČENJE
          </p>

          <h2>
            Svežina za kavče, stole in <em>preproge.</em>
          </h2>

          <p>
            Globinsko čiščenje oblazinjenega pohištva odstrani prah, madeže in
            neprijetne vonjave iz tekstila, ki ga uporabljate vsak dan.
          </p>

          <div className="deep-minimum">
            Minimalno naročilo <strong>€{deepCleaningMinimumOrder}</strong>
          </div>

          <a className="primary-button" href="#povprasevanje">
            Pošlji povpraševanje <span>→</span>
          </a>
        </div>

        <div className="deep-price-grid">
          {deepCleaningPrices.map((price) => (
            <article key={price.item}>
              <div>
                <h3>{price.item}</h3>
                <p>Cena na {price.unit}</p>
              </div>
              <strong>€{price.price}</strong>
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
            Pošljite povpraševanje za globinsko čiščenje.
          </h2>
          <p className="mb-8 leading-8 text-[#5d716a]">
            Vpišite svoje podatke in kratko sporočilo do 500 znakov.
          </p>

          <Suspense fallback={null}>
            <BusinessInquiryForm defaultService="Globinsko čiščenje" />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
