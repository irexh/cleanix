import Image from "next/image";

const includedItems = [
  "Sesanje in pomivanje tal",
  "Brisanje prahu z dosegljivih površin",
  "Čiščenje kuhinjskih površin",
  "Čiščenje kopalnice",
  "Osnovno urejanje prostora"
];

const suitableFor = [
  "Stanovanja in hiše v Ljubljani",
  "Tedensko čiščenje",
  "Čiščenje na 14 dni",
  "Mesečno vzdrževanje čistoče"
];

export default function RednoCiscenjePage() {
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

          <h1>Redno čiščenje</h1>

          <p>
            Redno čiščenje je namenjeno vzdrževanju urejenega doma na tedenski,
            14-dnevni ali mesečni osnovi. Storitev prilagodimo vašemu prostoru,
            ritmu in dogovorjenemu terminu.
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
            src="/images/redno-ciscenje-hero.png"
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
