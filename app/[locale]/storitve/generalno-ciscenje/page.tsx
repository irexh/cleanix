import Image from "next/image";

const includedItems = [
  "Temeljitejše čiščenje kuhinje in kopalnice",
  "Čiščenje težje dostopnih površin",
  "Odstranjevanje vodnega kamna",
  "Natančnejše brisanje površin",
  "Dodatna opravila po dogovoru"
];

const suitableFor = [
  "Občasno globlje čiščenje doma",
  "Dodatno osvežitev prostora",
  "Kuhinjo in kopalnico, ki potrebujeta več pozornosti",
  "Stranke, ki želijo temeljitejši obisk"
];

export default function GeneralnoCiscenjePage() {
  return (
    <main className="service-detail-page">
      <section className="service-detail-hero service-detail-hero-with-image service-detail-hero-overlay">
        <div className="service-detail-copy">
        <a href="/" className="service-detail-back">
          ← Nazaj domov
        </a>

        <p className="eyebrow">
          <span /> STORITVE
        </p>

        <h1>Generalno čiščenje</h1>

        <p>
          Generalno čiščenje je bolj temeljit obisk, ko dom potrebuje dodatno
          osvežitev. Osredotočimo se na površine in prostore, ki pri rednem
          čiščenju potrebujejo več časa in natančnosti.
        </p>

        <div className="service-detail-actions">
          <a href="/booking" className="primary-button">
            Rezerviraj termin <span>→</span>
          </a>
          <a href="/#storitve" className="text-link">
            Nazaj na storitve
          </a>
        </div>
        </div>

        <div className="service-detail-visual" aria-hidden="true">
          <Image
            src="/images/generalno-ciscenje-hero.png"
            alt=""
            fill
            className="service-detail-image"
            sizes="(max-width: 900px) 100vw, 56vw"
            priority
          />
        </div>
      </section>

      <section className="service-detail-content">
        <article>
          <h2>Kaj vključuje?</h2>
          <ul>
            {includedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h2>Primerno za</h2>
          <ul>
            {suitableFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
