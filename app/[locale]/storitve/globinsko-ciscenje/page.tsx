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

          <a className="primary-button" href="/contact">
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
    </main>
  );
}
