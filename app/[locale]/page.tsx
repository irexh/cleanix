import Image from "next/image";

import {auth} from "@/auth";
import {getActiveHomepageSales} from "@/lib/sale-pricing";
import {announcementPrisma} from "@/lib/announcement-prisma";
import {galleryPrisma} from "@/lib/gallery-prisma";
import {getSiteContentMap} from "@/lib/site-content";
import SiteFooter from "@/components/SiteFooter";
import Header from "@/components/Header";

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
    text: "Temeljito čiščenje vseh prostorov od A do Ž.",
    href: "/storitve/generalno-ciscenje",
    status: "active"
  },
  {
    number: "03",
    title: "Poslovni prostori",
    text: "Čista in urejena delovna okolja za vaše zaposlene.",
    href: "/business",
    status: "active"
  },
  {
    number: "04",
    title: "Dodatne storitve",
    text: "Prilagodljive storitve po vaših željah.",
    href: "/storitve/steklene-povrsine",
    status: "active"
  }
];

const trustHighlights = [
  {
    icon: "shield",
    title: "Preverjeni izvajalci",
    text: "Skrbno izbrani in pregledani izvajalci."
  },
  {
    icon: "calendar",
    title: "Enostavno naročilo",
    text: "Izberete termin in storitev v nekaj klikih."
  },
  {
    icon: "lock",
    title: "Zavarovano čiščenje",
    text: "Za vaše zadovoljstvo poskrbimo mi."
  },
  {
    icon: "support",
    title: "Podpora uporabnikom",
    text: "Vedno smo na voljo, ko nas potrebujete."
  }
];

const aboutFeatures = [
  {
    icon: "✓",
    title: "Preverjeni izvajalci",
    text: "Vsak član ekipe je skrbno izbran, usposobljen in zanesljiv."
  },
  {
    icon: "✓",
    title: "Brez skrbi",
    text: "Prilagodljiv termin, jasna cena in pomoč naše ekipe, ko jo potrebujete."
  },
  {
    icon: "✓",
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
  const session = await auth();
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
  const profileHref =
    session?.user?.role === "ADMIN"
      ? "/sl/admin"
      : session?.user?.role === "EMPLOYEE" || session?.user?.role === "MANAGER"
        ? "/sl/employee"
        : "/sl/profile";

  return (
    <main>
      <Header
        hasSale={activeSales.length > 0}
        showProfile={Boolean(session?.user?.email)}
        profileHref={profileHref}
      />

      <section className="hero hero-premium" id="domov">
        <div className="hero-copy hero-copy-premium">
          <p
            className="hero-animate-kicker hero-premium-kicker"
            style={{letterSpacing: "0.18em"}}
          >
            PROFESIONALNO ČIŠČENJE DOMA
          </p>

          <h1
            className="hero-animate-title hero-premium-title"
            style={{letterSpacing: "0.01em"}}
          >
            <span>Čist dom.</span>
            <br />
            <span className="hero-title-nowrap">Brez izgubljenega časa.</span>
          </h1>

          <p className="hero-animate-text hero-premium-text">
            Preverjeni izvajalci, jasne cene in enostavno naročilo čiščenja.
          </p>

          <div className="hero-actions hero-actions-premium hero-animate-actions">
            <a className="primary-button hero-primary-button" href="/booking">
              Naroči čiščenje <span>→</span>
            </a>

            <a className="text-link hero-secondary-link" href="#kako-poteka">
              Poglej, kako deluje <span>↓</span>
            </a>
          </div>

          <div className="hero-badges" style={{letterSpacing: "0.01em"}}>
            <span>◉ Brez vezave</span>
            <span>◉ Varen termin</span>
            <span>◉ Preverjeni izvajalci</span>
          </div>

          <div className="hero-rating" style={{letterSpacing: "0.01em"}}>
            <div className="hero-rating-avatars" aria-hidden="true">
              <span>J</span>
              <span>M</span>
              <span>A</span>
            </div>

            <div className="hero-rating-copy">
              <strong>
                4,9 <span>★★★★★</span>
              </strong>
              <p>več kot 2.000 zadovoljnih domov</p>
            </div>
          </div>
        </div>

        <div className="hero-art hero-art-premium" aria-hidden="true">
          <Image
            src="/images/homepage-hero-reference.png"
            alt="cleanix ekipa pri čiščenju doma"
            fill
            className="hero-art-image"
            sizes="(max-width: 1024px) 100vw, 56vw"
            priority
          />
        </div>
      </section>

      <section className="hero-trust-strip">
        {trustHighlights.map((feature) => (
          <article className="hero-trust-card" key={feature.title}>
            <div className="hero-trust-icon" aria-hidden="true">
              <span className={`hero-trust-glyph hero-trust-glyph-${feature.icon}`} />
            </div>
            <div>
              <h3 style={{letterSpacing: "0.01em"}}>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </article>
        ))}
      </section>

      {activeSales.length > 0 ? <div id="akcija" className="sale-anchor" /> : null}

      {homeCleaningSales.length > 0 ? (
        <section className="sale-banner sale-banner-list">
          <div className="sale-banner-heading">
            <p className="sale-kicker">AKCIJA</p>
            <h2 style={{letterSpacing: "0.01em"}}>Trenutne akcije za čiščenje doma</h2>
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
            <h2 style={{letterSpacing: "0.01em"}}>Cleanix Business akcije</h2>
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
            <h2 style={{letterSpacing: "0.01em"}}>Novice in obvestila</h2>
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
          <h2 style={{letterSpacing: "0.01em"}}>{content.home_quick_title}</h2>
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
          <h2 style={{letterSpacing: "0.01em"}}>
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
            <h3 style={{letterSpacing: "0.01em"}}>Oddate povpraševanje</h3>
            <p>Izberete storitev, termin in osnovne podatke za vaš obisk.</p>
          </article>

          <article className="process-card">
            <p className="process-number">02</p>
            <h3 style={{letterSpacing: "0.01em"}}>Potrdimo podrobnosti</h3>
            <p>Pregledamo vašo zahtevo in po potrebi uskladimo dodatne informacije.</p>
          </article>

          <article className="process-card">
            <p className="process-number">03</p>
            <h3 style={{letterSpacing: "0.01em"}}>Prihod ekipe</h3>
            <p>Ob dogovorjenem času pride zanesljiva ekipa z vso potrebno opremo.</p>
          </article>

          <article className="process-card">
            <p className="process-number">04</p>
            <h3 style={{letterSpacing: "0.01em"}}>Uživajte v čistem domu</h3>
            <p>Vi pa imate več časa za pomembnejše stvari, medtem ko mi poskrbimo za rezultat.</p>
          </article>
        </div>
      </section>

      <section className="steps" id="kako-deluje">
        <div className="section-intro">
          <p className="eyebrow">
            <span /> {content.home_steps_kicker}
          </p>
          <h2 style={{letterSpacing: "0.01em"}}>
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
              <h3 style={{letterSpacing: "0.01em"}}>Izberite storitev</h3>
              <p>Povejte nam, kaj vaš dom potrebuje in kako pogosto bi želeli čiščenje.</p>
            </div>
          </article>

          <article>
            <div className="step-number">2</div>
            <div>
              <h3 style={{letterSpacing: "0.01em"}}>Določite termin</h3>
              <p>Izberite datum in uro, ki se najbolj prilegata vašemu ritmu.</p>
            </div>
          </article>

          <article>
            <div className="step-number">3</div>
            <div>
              <h3 style={{letterSpacing: "0.01em"}}>Uživajte v čistem domu</h3>
              <p>Naša ekipa pride pripravljena, vi pa se vrnete v prijeten in svež dom.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="service-section service-section-premium" id="storitve">
        <div className="section-intro service-section-intro-premium">
          <p className="eyebrow">
            <span /> STORITVE
          </p>
          <h2 style={{letterSpacing: "0.01em"}}>Izberite storitev, ki ustreza vašim potrebam</h2>
          <p className="intro-copy">
            Čista rešitev za dom in poslovne prostore, brez nepotrebnega kompliciranja.
          </p>
        </div>

        <div className="service-grid service-grid-premium">
          {services.map((service) => (
            <article className="service-card service-card-premium" key={service.number}>
              <div className="service-icon service-icon-premium">{service.number}</div>
              <h3 style={{letterSpacing: "0.01em"}}>{service.title}</h3>
              <p>{service.text}</p>

              <a href={service.href}>
                Preverite več <span>→</span>
              </a>
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
            <h2 style={{letterSpacing: "0.01em"}}>Utrinki našega dela.</h2>
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
          <div className="bubble b1">✓</div>
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
          <h2 className="trust-title" style={{letterSpacing: "0.01em"}}>
            <span>{content.home_trust_title_1}</span>
            <em>{content.home_trust_title_2}</em>
          </h2>
          <p>{content.home_trust_text}</p>

          <div className="feature-list">
            {aboutFeatures.map((feature) => (
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
        <h2 style={{letterSpacing: "0.01em"}}>{content.home_bottom_title}</h2>
        <a href="/booking" className="light-button">
          {content.home_bottom_button} <span>→</span>
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}
