const glassCleaningPrices = [
  {item: "Steklene pregrade", unit: "m²", price: "po dogovoru"},
  {item: "Izložbena stekla", unit: "m²", price: "po dogovoru"},
  {item: "Steklena vrata", unit: "kos", price: "po dogovoru"},
  {item: "Ogledala", unit: "m²", price: "po dogovoru"}
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

          <a className="primary-button" href="/contact">
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
    </main>
  );
}
