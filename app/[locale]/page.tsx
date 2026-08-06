import Image from "next/image";

import {getActiveHomepageSales} from "@/lib/sale-pricing";
import {announcementPrisma} from "@/lib/announcement-prisma";
import {galleryPrisma} from "@/lib/gallery-prisma";
import {getSiteContentMap} from "@/lib/site-content";

export const dynamic = "force-dynamic";

const services = [
  {
    number: "01",
    title: "Redno čiščenje",
    text: "Redno vzdrževanje urejenega doma vsak teden, na 14 dni ali enkrat mesečno.",
    href: "/storitve/redno-ciscenje",
    status: "active"
  },
  {
    number: "02",
    title: "Generalno čiščenje",
    text: "Bolj temeljito čiščenje doma, ko potrebujete dodatno osvežitev prostora.",
    href: "/storitve/generalno-ciscenje",
    status: "active"
  },
  {
    number: "03",
    title: "Pomoč v gospodinjstvu",
    text: "Kmalu na voljo.",
    href: "",
    status: "hidden"
  },
  {
    number: "04",
    title: "Pranje steklenih površin",
    text: "Čiščenje steklenih vrat, ogledal, pregrad in izložbenih površin.",
    href: "/storitve/steklene-povrsine",
    status: "active"
  },
  {
    number: "05",
    title: "Globinsko čiščenje",
    text: "Globinsko čiščenje kavčev, stolov, sedežev in preprog.",
    href: "/storitve/globinsko-ciscenje",
    status: "active"
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

function saleFrequencyLabel(frequency: string) {
  const [baseFrequency, duration] = frequency.split("__");
  const label =
    baseFrequency === "ENKRATNO"
      ? "enkratno čiščenje"
      : baseFrequency === "NA_DVA_TEDNA"
        ? "čiščenje na dva tedna"
        : "mesečno čiščenje";

  return duration ? `${label} · ${duration}` : label;
}

export default async function Home() {
  const activeSales = await getActiveHomepageSales().catch(() => []);
  const homeCleaningSales = activeSales.filter(
    (sale) => sale.serviceKey !== "BUSINESS_CONTRACT"
  );
  const businessSales = activeSales.filter(
    (sale) => sale.serviceKey === "BUSINESS_CONTRACT"
  );
  const announcements = await announcementPrisma.announcement.findMany({
    where: {isActive: true},
    orderBy: {createdAt: "desc"}
  });
  const galleryImages = await galleryPrisma.galleryImage.findMany({
    where: {isActive: true},
    orderBy: {createdAt: "desc"}
  });
  const content = await getSiteContentMap();

  return (
    <main>
      <header className="site-header">
        <a href="#domov" className="brand" aria-label="cleanix domov">
          <Image
            src="/images/cisto-logo-transparent.png"
            alt="cleanix logo"
            width={38}
            height={38}
            className="brand-logo"
          />
          <span>cleanix</span>
        </a>

        <nav className="desktop-nav" aria-label="Glavna navigacija">
          <a href="#kako-deluje">Kako deluje</a>
          <a href="#storitve">Storitve</a>
          <a href="/business">Cleanix Business</a>
          <a href="#o-nas">Zakaj cleanix</a>
        </nav>

        <a className="hidden" href="/booking">
          {content.home_hero_primary_button} <span>→</span>
        </a>

        {activeSales.length > 0 ? (
          <a className="sale-gift-link" href="#akcija" aria-label="Poglej akcijo">
            <span>🎁</span>
            Akcija
          </a>
        ) : null}
      </header>

      <section className="hero" id="domov">
        <div className="hero-copy">
          <p className="hero-animate-kicker">{content.home_hero_kicker}</p>

          <h1 className="hero-animate-title">{content.home_hero_title}</h1>

          <p className="hero-animate-text">
            {content.home_hero_text.split("\n").map((line, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>

          <div className="hero-actions hero-animate-actions">
            <a className="primary-button" href="/booking">
              {content.home_hero_primary_button} <span>→</span>
            </a>

            <a className="text-link" href="#kako-poteka">
              {content.home_hero_secondary_button} <span>↓</span>
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
                {content.home_rating_score} <span>★★★★★</span>
              </strong>
              <p>{content.home_rating_text}</p>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <Image
            src={content.home_hero_image}
            alt="cleanix ekipa pri čiščenju doma"
            fill
            className="hero-art-image"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </section>

      {activeSales.length > 0 ? <div id="akcija" className="sale-anchor" /> : null}

      {homeCleaningSales.length > 0 ? (
        <section className="sale-banner sale-banner-list">
          <div className="sale-banner-heading">
            <p className="sale-kicker">AKCIJA</p>
            <h2>Trenutne akcije za čiščenje doma</h2>
          </div>

          <div className="sale-card-grid">
            {homeCleaningSales.map((sale) => (
              <article className="sale-card" key={sale.id}>
                {sale.serviceKey === "BUSINESS_CONTRACT" ? (
                  <>
                    <h3>Cleanix Business · {sale.salePrice}% popust</h3>
                    <p>
                      Prvi 3 meseci ob 12-mesečnem sodelovanju
                      {sale.saleEndsAt ? ` do ${sale.saleEndsAt}` : ""}.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>
                      {sale.sizeRange} · samo €{sale.salePrice}
                    </h3>
                    <p>
                      Velja za {saleFrequencyLabel(sale.frequency)}
                      {sale.saleEndsAt ? ` do ${sale.saleEndsAt}` : ""}.
                    </p>
                  </>
                )}
              </article>
            ))}
          </div>

          <a className="sale-banner-cta" href="/booking">
            Izkoristi akcijo <span>→</span>
          </a>
        </section>
      ) : null}

      {businessSales.length > 0 ? (
        <section className="sale-banner sale-banner-list sale-banner-business">
          <div className="sale-banner-heading">
            <p className="sale-kicker">AKCIJA ZA PODJETJA</p>
            <h2>Cleanix Business akcije</h2>
          </div>

          <div className="sale-card-grid">
            {businessSales.map((sale) => (
              <article className="sale-card" key={sale.id}>
                <h3>Cleanix Business · {sale.salePrice}% popust</h3>
                <p>
                  Prvi 3 meseci ob 12-mesečnem sodelovanju
                  {sale.saleEndsAt ? ` do ${sale.saleEndsAt}` : ""}.
                </p>
              </article>
            ))}
          </div>

          <a className="sale-banner-cta" href="/business">
            Poglej Business <span>→</span>
          </a>
        </section>
      ) : null}

      {announcements.length > 0 ? (
        <section className="announcement-section">
          <div className="announcement-heading">
            <p className="eyebrow">
              <span /> NOVOSTI
            </p>
            <h2>Risi in obvestila</h2>
          </div>

          <div className="announcement-grid">
            {announcements.map((announcement) => (
              <article className="announcement-card" key={announcement.id}>
                <h3>{announcement.title}</h3>
                <p>{announcement.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="quick-book" id="narocilo">
        <div className="quick-book-heading">
          <p className="eyebrow">
            <span /> {content.home_quick_kicker}
          </p>
          <h2>{content.home_quick_title}</h2>
        </div>

        <a className="book-button" href="/booking">
          {content.home_quick_button} <span>→</span>
        </a>
      </section>

      <section className="process-section" id="kako-poteka">
        <div className="section-intro">
          <p className="eyebrow">
            <span /> {content.home_process_kicker}
          </p>
          <h2>
            {content.home_process_title.split("\n").map((line, index) =>
              index === 0 ? (
                <span key={`${line}-${index}`}>{line} </span>
              ) : (
                <em key={`${line}-${index}`}>{line}</em>
              )
            )}
          </h2>
        </div>

        <div className="process-grid">
          <article className="process-card">
            <p className="process-number">01</p>
            <h3>Oddate povpraševanje</h3>
            <p>Izberete storitev, termin in osnovne podatke za vaš obisk.</p>
          </article>

          <article className="process-card">
            <p className="process-number">02</p>
            <h3>Potrdimo podrobnosti</h3>
            <p>
              Pregledamo vašo zahtevo in po potrebi uskladimo dodatne
              informacije.
            </p>
          </article>

          <article className="process-card">
            <p className="process-number">03</p>
            <h3>Prihod ekipe</h3>
            <p>
              Ob dogovorjenem času pride zanesljiva ekipa z vso potrebno
              opremo.
            </p>
          </article>

          <article className="process-card">
            <p className="process-number">04</p>
            <h3>Uživajte v čistem domu</h3>
            <p>
              Vi pa imate več časa za pomembnejše stvari, medtem ko mi
              poskrbimo za brezhiben rezultat.
            </p>
          </article>
        </div>
      </section>

      <section className="steps" id="kako-deluje">
        <div className="section-intro">
          <p className="eyebrow">
            <span /> {content.home_steps_kicker}
          </p>
          <h2>
            {content.home_steps_title.split("\n").map((line, index) =>
              index === 0 ? (
                <span key={`${line}-${index}`}>{line} </span>
              ) : (
                <em key={`${line}-${index}`}>{line}</em>
              )
            )}
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
            <span /> {content.home_services_kicker}
          </p>
          <h2>
            {content.home_services_title}
          </h2>
          <p className="intro-copy">
            {content.home_services_text}
          </p>
        </div>

        <div className="service-grid">
          {services.filter((service) => service.status !== "hidden").map((service) => (
            <article className="service-card" key={service.number}>
              <p>{service.number}</p>
              <div className="service-icon">✦</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>

              {service.status === "soon" ? (
                <span className="soon-badge">KMALU</span>
              ) : (
                <a href={service.href}>
                  Preverite več <span>→</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {galleryImages.length > 0 ? (
        <section className="homepage-gallery">
          <div className="section-intro">
            <p className="eyebrow">
              <span /> GALERIJA
            </p>
            <h2>Utrinki našega dela.</h2>
          </div>

          <div className="homepage-gallery-grid">
            {galleryImages.map((image) => (
              <article className="homepage-gallery-card" key={image.id}>
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span>{image.title}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

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
            <span /> {content.home_trust_kicker}
          </p>
          <h2 className="trust-title">
            <span>{content.home_trust_title_1}</span>
            <em>{content.home_trust_title_2}</em>
          </h2>
          <p>
            {content.home_trust_text}
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
        <p>{content.home_bottom_kicker}</p>
        <h2>{content.home_bottom_title}</h2>
        <a href="/booking" className="light-button">
          {content.home_bottom_button} <span>→</span>
        </a>
      </section>
    </main>
  );
}
