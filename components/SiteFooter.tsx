import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-shell">
        <div className="site-footer-top">
          <div className="site-footer-brand-block">
            <a href="/" className="brand" aria-label="cleanix domov">
              <Image
                src="/images/cisto-logo-transparent.png"
                alt="cleanix logo"
                width={38}
                height={38}
                className="brand-logo"
              />
              <span>cleanix</span>
            </a>

            <div className="mt-3">
              <a href="/business" className="text-link">
                cleanix Biznis
              </a>
            </div>

            <p className="site-footer-copy">
              Profesionalno čiščenje doma v Ljubljani. Hitra rezervacija,
              zanesljiva ekipa in preprost postopek od naročila do obiska.
            </p>

            <div className="site-footer-pill-row">
              <span className="site-footer-pill">Ljubljana</span>
              <span className="site-footer-pill">Na voljo zdaj</span>
              <span className="site-footer-pill">Povpraševanje online</span>
            </div>
          </div>

          <div className="site-footer-card-grid">
            <section className="site-footer-card">
              <p className="site-footer-title">Kontakt</p>
              <div className="site-footer-links">
                <a href="tel:069665229">069 665 229</a>
                <a href="mailto:info@cleanix.si">info@cleanix.si</a>
                <span>Ljubljana, Slovenija</span>
              </div>
            </section>

            <section className="site-footer-card">
              <p className="site-footer-title">Hitre povezave</p>
              <div className="site-footer-links">
                <a href="/">Domov</a>
                <a href="/booking">Rezervacija</a>
                <a href="/business">cleanix Biznis</a>
                <a href="/contact">Kontakt</a>
                <a href="/about">O nas</a>
              </div>
            </section>

            <section className="site-footer-card">
              <p className="site-footer-title">Delovni čas</p>
              <div className="site-footer-links">
                <span>Pon - Pet: 08:00 - 18:00</span>
                <span>Sobota: 09:00 - 14:00</span>
                <span>Nedelja: po dogovoru</span>
              </div>
            </section>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© 2026 cleanix. Vse pravice pridržane.</p>

          <div className="site-footer-bottom-links">
            <a href="/privacy">Zasebnost</a>
            <a href="/terms">Pogoji uporabe</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
