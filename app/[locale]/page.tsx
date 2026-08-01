const services = [
  {
    number: "01",
    title: "Redno čiščenje",
    text: "Urejen dom vsak teden, na 14 dni ali takrat, ko vam najbolj ustreza."
  },
  {
    number: "02",
    title: "Generalno čiščenje",
    text: "Temeljita osvežitev doma pred vselitvijo, po prenovi ali ob posebni priložnosti."
  },
  {
    number: "03",
    title: "Pomoč v gospodinjstvu",
    text: "Pranje, likanje in druga drobna opravila za bolj preprost vsakdan."
  }
];

const features = [
  {
    icon: "✓",
    title: "Preverjeni čistilci",
    text: "Vsak član ekipe je skrbno izbran, usposobljen in zanesljiv."
  },
  {
    icon: "♥",
    title: "Brez skrbi",
    text: "Prilagodljiv termin, jasna cena in pomoč naše ekipe, ko jo potrebujete."
  },
  {
    icon: "✦",
    title: "Čist dom, več časa",
    text: "Medtem ko mi poskrbimo za dom, vi uživate v svojem dnevu."
  }
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a href="#domov" className="brand" aria-label="Cleanix domov">
          <span className="brand-mark">✦</span>
          cleanix
        </a>

        <nav className="desktop-nav" aria-label="Glavna navigacija">
          <a href="#kako-deluje">Kako deluje</a>
          <a href="#storitve">Storitve</a>
          <a href="#o-nas">Zakaj Cleanix</a>
        </nav>

        <a className="header-cta" href="/booking">
          Naroči čiščenje <span>→</span>
        </a>
      </header>

      <section className="hero" id="domov">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> PROFESIONALNO ČIŠČENJE DOMA
          </p>

          <h1>
            Več časa za <em>lepe</em> stvari.
          </h1>

          <p className="hero-text">
            Zanesljivo čiščenje doma po vaši meri. Izberite termin, mi pa
            poskrbimo, da bo vaš dom zasijal.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#narocilo">
              Naroči čiščenje <span>→</span>
            </a>

            <a className="text-link" href="#kako-deluje">
              Poglej, kako deluje <span>↓</span>
            </a>
          </div>

          <div className="rating">
            <div className="avatar-stack">
              <i>J</i>
              <i>M</i>
              <i>A</i>
            </div>

            <div>
              <strong>
                4,9 <span>★★★★★</span>
              </strong>
              <p>več kot 2.000 zadovoljnih domov</p>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="sun" />
          <div className="plant">
            <b />
            <b />
            <b />
            <b />
          </div>
          <div className="spark s1">✦</div>
          <div className="spark s2">✦</div>
          <div className="spark s3">·</div>

          <div className="cleaner">
            <div className="cleaner-head" />
            <div className="cleaner-body" />
            <div className="cleaner-arm" />
            <div className="spray">
              <span />
            </div>
          </div>

          <div className="floor" />
          <p className="art-label">ČISTO. PREPROSTO. VAŠE.</p>
        </div>
      </section>

      <section className="quick-book" id="narocilo">
        <div className="quick-book-heading">
          <p className="eyebrow">
            <span /> ZAČNIMO
          </p>
          <h2>Naročite v manj kot minuti.</h2>
        </div>

        <a className="book-button" href="#kako-deluje">
          Začni rezervacijo <span>→</span>
        </a>
      </section>

      <section className="steps" id="kako-deluje">
        <div className="section-intro">
          <p className="eyebrow">
            <span /> KAKO DELUJE
          </p>
          <h2>
            Do čistega doma v <br />
            <em>treh preprostih korakih.</em>
          </h2>
        </div>

        <div className="step-list">
          <article>
            <div className="step-number">1</div>
            <div>
              <h3>Izberite storitev</h3>
              <p>
                Povejte nam, kaj vaš dom potrebuje in kako pogosto bi želeli
                čiščenje.
              </p>
            </div>
          </article>

          <article>
            <div className="step-number">2</div>
            <div>
              <h3>Določite termin</h3>
              <p>
                Izberite datum in uro, ki se najbolj prilegata vašemu ritmu.
              </p>
            </div>
          </article>

          <article>
            <div className="step-number">3</div>
            <div>
              <h3>Uživajte v čistem domu</h3>
              <p>
                Naša ekipa pride pripravljena, vi pa se vrnete v prijeten in
                svež dom.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="service-section" id="storitve">
        <div className="section-intro">
          <p className="eyebrow">
            <span /> NAŠE STORITVE
          </p>
          <h2>
            Čisto po <em>vaše.</em>
          </h2>
          <p className="intro-copy">
            Naj bo to reden obisk ali temeljita osvežitev — izberite pomoč, ki
            jo potrebujete danes.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <p>{service.number}</p>
              <div className="service-icon">✦</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <a href="#narocilo">
                Preverite več <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section" id="o-nas">
        <div className="trust-art" aria-hidden="true">
          <div className="arch" />
          <div className="bubble b1">✦</div>
          <div className="bubble b2">✓</div>
          <div className="house">
            <div className="roof" />
            <div className="door" />
            <div className="window" />
          </div>
        </div>

        <div className="trust-copy">
          <p className="eyebrow">
            <span /> ZAKAJ CLEANIX
          </p>
          <h2>
            Dober občutek se začne <em>doma.</em>
          </h2>
          <p>
            Čiščenje je osebna stvar. Zato gradimo storitev, ki je prijazna,
            pregledna in ji lahko zaupate.
          </p>

          <div className="feature-list">
            {features.map((feature) => (
              <div key={feature.title}>
                <b>{feature.icon}</b>
                <span>
                  <strong>{feature.title}</strong>
                  <small>{feature.text}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-cta">
        <p>PRIPRAVLJENI NA VEČ PROSTEGA ČASA?</p>
        <h2>Naj vaš dom zasije.</h2>
        <a href="#narocilo" className="light-button">
          Naroči čiščenje <span>→</span>
        </a>
      </section>

      <footer>
        <a className="brand" href="#domov">
          <span className="brand-mark">✦</span>
          cleanix
        </a>
        <p>Čist dom. Mirna glava.</p>
        <span>© 2026 Cleanix</span>
      </footer>
    </main>
  );
}