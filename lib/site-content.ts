import {prisma} from "@/lib/prisma";

export type SiteContentItem = {
  key: string;
  label: string;
  value: string;
};

export const defaultSiteContent: SiteContentItem[] = [
  {
    key: "home_hero_kicker",
    label: "Homepage - mali naslov",
    value: "PROFESIONALNO ČIŠČENJE DOMA"
  },
  {
    key: "home_hero_title",
    label: "Homepage - glavni naslov",
    value: "Več časa za lepe stvari."
  },
  {
    key: "home_hero_text",
    label: "Homepage - opis",
    value:
      "Zanesljivo čiščenje doma po vaši meri. Izberite termin, mi pa poskrbimo,\nda bo vaš dom zasijal."
  },
  {
    key: "home_hero_primary_button",
    label: "Homepage - glavni gumb",
    value: "Naroči čiščenje"
  },
  {
    key: "home_hero_secondary_button",
    label: "Homepage - drugi gumb",
    value: "Poglej, kako poteka"
  },
  {
    key: "home_rating_score",
    label: "Homepage - ocena",
    value: "4,9"
  },
  {
    key: "home_rating_text",
    label: "Homepage - tekst pri oceni",
    value: "več kot 2.000 zadovoljnih domov"
  },
  {
    key: "home_quick_kicker",
    label: "Homepage - quick box mali naslov",
    value: "ZAČNIMO"
  },
  {
    key: "home_quick_title",
    label: "Homepage - quick box naslov",
    value: "Naročite v manj kot minuti."
  },
  {
    key: "home_quick_button",
    label: "Homepage - quick box gumb",
    value: "Začni rezervacijo"
  },
  {
    key: "home_process_kicker",
    label: "Homepage - kako poteka mali naslov",
    value: "KAKO POTEKA"
  },
  {
    key: "home_process_title",
    label: "Homepage - kako poteka naslov",
    value: "Preprost postopek od povpraševanja do\nbrezhibno čistega doma."
  },
  {
    key: "home_steps_kicker",
    label: "Homepage - kako deluje mali naslov",
    value: "KAKO DELUJE"
  },
  {
    key: "home_steps_title",
    label: "Homepage - kako deluje naslov",
    value: "Do čistega doma v\ntreh preprostih korakih."
  },
  {
    key: "home_services_kicker",
    label: "Homepage - storitve mali naslov",
    value: "NAŠE STORITVE"
  },
  {
    key: "home_services_title",
    label: "Homepage - storitve naslov",
    value: "cleanix po vaše."
  },
  {
    key: "home_services_text",
    label: "Homepage - storitve opis",
    value:
      "Naj bo to reden obisk ali temeljita osvežitev, izberite pomoč, ki jo potrebujete danes."
  },
  {
    key: "home_trust_kicker",
    label: "Homepage - zakaj cleanix mali naslov",
    value: "ZAKAJ CLEANIX"
  },
  {
    key: "home_trust_title_1",
    label: "Homepage - zakaj cleanix naslov 1",
    value: "Dober občutek se začne"
  },
  {
    key: "home_trust_title_2",
    label: "Homepage - zakaj cleanix naslov 2",
    value: "doma."
  },
  {
    key: "home_trust_text",
    label: "Homepage - zakaj cleanix opis",
    value:
      "Čiščenje je osebna stvar. Zato gradimo storitev, ki je prijazna, pregledna in ji lahko zaupate."
  },
  {
    key: "home_bottom_kicker",
    label: "Homepage - spodnji CTA mali naslov",
    value: "PRIPRAVLJENI NA VEČ PROSTEGA ČASA?"
  },
  {
    key: "home_bottom_title",
    label: "Homepage - spodnji CTA naslov",
    value: "Naj vaš dom zasije."
  },
  {
    key: "home_bottom_button",
    label: "Homepage - spodnji CTA gumb",
    value: "Naroči čiščenje"
  },
  {
    key: "business_hero_kicker",
    label: "Business - mali naslov",
    value: "CLEANIX BUSINESS"
  },
  {
    key: "business_hero_title",
    label: "Business - glavni naslov",
    value: "Profesionalno čiščenje za poslovne prostore."
  },
  {
    key: "business_hero_text",
    label: "Business - opis",
    value:
      "Za pisarne, salone, lokale, ordinacije in druge poslovne prostore, kjer sta urejenost in zanesljivost del prvega vtisa."
  }
];

type SiteContentRecord = SiteContentItem & {
  id: string;
  updatedAt: Date;
};

type SiteContentDelegate = {
  findMany(args?: unknown): Promise<SiteContentRecord[]>;
  upsert(args: unknown): Promise<SiteContentRecord>;
};

const siteContentPrisma = prisma as typeof prisma & {
  siteContent: SiteContentDelegate;
};

export async function ensureDefaultSiteContent() {
  await Promise.all(
    defaultSiteContent.map((item) =>
      siteContentPrisma.siteContent.upsert({
        where: {key: item.key},
        update: {},
        create: item
      })
    )
  );
}

export async function getSiteContentMap() {
  await ensureDefaultSiteContent();

  const rows = await siteContentPrisma.siteContent.findMany();
  const fallback = Object.fromEntries(
    defaultSiteContent.map((item) => [item.key, item.value])
  );

  return rows.reduce<Record<string, string>>((content, row) => {
    content[row.key] = row.value;
    return content;
  }, fallback);
}

export async function getSiteContentItems() {
  await ensureDefaultSiteContent();

  const rows = await siteContentPrisma.siteContent.findMany({
    orderBy: {key: "asc"}
  });
  const labels = Object.fromEntries(
    defaultSiteContent.map((item) => [item.key, item.label])
  );

  return rows.map((row) => ({
    ...row,
    label: labels[row.key] ?? row.label
  }));
}

export {siteContentPrisma};
