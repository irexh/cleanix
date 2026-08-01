export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-shell">
        <div className="site-footer-top">
          <div className="site-footer-brand-block">
            <a href="/" className="brand" aria-label="Cleanix domov">
              <span className="brand-mark">✦</span>
              cleanix
            </a>

            <p className="site-footer-copy">
              Profesionalno ciscenje doma v Ljubljani. Hitra rezervacija,
              zanesljiva ekipa in preprost postopek od narocila do obiska.
            </p>

            <div className="site-footer-pill-row">
              <span className="site-footer-pill">Ljubljana</span>
              <span className="site-footer-pill">Na voljo zdaj</span>
              <span className="site-footer-pill">Placilo online</span>
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
                <a href="/contact">Kontakt</a>
                <a href="/about">O nas</a>
              </div>
            </section>

            <section className="site-footer-card">
              <p className="site-footer-title">Delovni cas</p>
              <div className="site-footer-links">
                <span>Pon - Pet: 08:00 - 18:00</span>
                <span>Sobota: 09:00 - 14:00</span>
                <span>Nedelja: po dogovoru</span>
              </div>
            </section>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© 2026 Cleanix. Vse pravice pridrzane.</p>

          <div className="site-footer-bottom-links">
            <a href="/privacy">Zasebnost</a>
            <a href="/terms">Pogoji uporabe</a>
          </div>
        </div>
      </div>
    </footer>
  );
}