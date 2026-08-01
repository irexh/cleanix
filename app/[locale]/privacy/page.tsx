export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-16 text-[#173e35]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="eyebrow">
            <span /> ZASEBNOST
          </p>
          <h1 className="mb-5 text-5xl font-bold">Politika zasebnosti</h1>
          <p className="max-w-3xl text-lg leading-8 text-[#5d716a]">
            Ta politika zasebnosti pojasnjuje, katere osebne podatke zbiramo,
            kako jih uporabljamo in kako jih varujemo pri uporabi spletne strani
            Cleanix.
          </p>
        </div>

        <section className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
          <PolicyBlock
            title="1. Katere podatke zbiramo"
            text="Ob rezervaciji lahko zbiramo ime in priimek, e-postni naslov, telefonsko stevilko, naslov ciscenja, mesto, izbrane storitve, termin rezervacije in morebitne dodatne opombe."
          />

          <PolicyBlock
            title="2. Namen uporabe podatkov"
            text="Podatke uporabljamo izkljucno za obdelavo rezervacije, komunikacijo s stranko, izvedbo narocene storitve in interno organizacijo dela."
          />

          <PolicyBlock
            title="3. Placila"
            text="Placila se obdelujejo preko zunanjega ponudnika Stripe. Cleanix ne shranjuje podatkov o placilnih karticah. Za obdelavo placil veljajo tudi pogoji in politika zasebnosti ponudnika Stripe."
          />

          <PolicyBlock
            title="4. Hramba podatkov"
            text="Podatke hranimo toliko casa, kolikor je potrebno za izvedbo storitve, evidenco rezervacij in izpolnjevanje morebitnih zakonskih obveznosti."
          />

          <PolicyBlock
            title="5. Deljenje podatkov"
            text="Osebnih podatkov ne prodajamo. Podatki se lahko delijo le s ponudniki storitev, ki so nujno potrebni za delovanje sistema, kot so ponudnik placil ali tehnicna infrastruktura."
          />

          <PolicyBlock
            title="6. Varovanje podatkov"
            text="Sprejemamo razumne tehnicne in organizacijske ukrepe za zascito osebnih podatkov pred nepooblascenim dostopom, izgubo ali zlorabo."
          />

          <PolicyBlock
            title="7. Vase pravice"
            text="Uporabnik lahko zahteva vpogled v svoje podatke, popravek netocnih podatkov ali izbris, kadar je to dopustno po veljavni zakonodaji."
          />

          <PolicyBlock
            title="8. Kontakt"
            text="Za vprasanja glede zasebnosti ali obdelave osebnih podatkov nas lahko kontaktirate na info@cleanix.si ali na telefonsko stevilko 069 665 229."
          />

          <div className="rounded-2xl bg-[#f8f5ef] p-5 text-sm text-[#5d716a]">
            Zadnja posodobitev: 1. avgust 2026
          </div>
        </section>
      </div>
    </main>
  );
}

function PolicyBlock({title, text}: {title: string; text: string}) {
  return (
    <div className="border-b border-[#ece7dc] pb-6 last:border-b-0 last:pb-0">
      <h2 className="mb-3 text-2xl font-bold">{title}</h2>
      <p className="leading-8 text-[#5d716a]">{text}</p>
    </div>
  );
}