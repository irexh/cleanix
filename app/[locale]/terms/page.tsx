export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-16 text-[#173e35]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="eyebrow">
            <span /> POGOJI
          </p>
          <h1 className="mb-5 text-5xl font-bold">Pogoji uporabe</h1>
          <p className="max-w-3xl text-lg leading-8 text-[#5d716a]">
            Ti pogoji uporabe določajo osnovna pravila uporabe spletne strani
            Cleanix in rezervacije storitev čiščenja preko naše platforme.
          </p>
        </div>

        <section className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm sm:p-10">
          <PolicyBlock
            title="1. Uporaba spletne strani"
            text="Spletna stran Cleanix je namenjena predstavitvi storitev in oddaji rezervacij za storitve čiščenja. Uporabnik se z uporabo strani strinja s temi pogoji."
          />

          <PolicyBlock
            title="2. Rezervacija storitve"
            text="Rezervacija je oddana, ko uporabnik izpolni zahtevane podatke, izbere termin in uspešno zaključi postopek plačila. Cleanix si pridržuje pravico do potrditve ali uskladitve termina, kadar je to potrebno."
          />

          <PolicyBlock
            title="3. Cene in plačilo"
            text="Cene so prikazane ob postopku rezervacije. Plačilo se izvede preko zunanjega ponudnika Stripe. Cleanix ne shranjuje podatkov o plačilnih karticah."
          />

          <PolicyBlock
            title="4. Odpovedi in spremembe"
            text="Za spremembo ali odpoved rezervacije naj nas stranka kontaktira čim prej. Cleanix si prizadeva biti prilagodljiv, vendar si v določenih primerih pridržuje pravico do stroškov odpovedi ali prilagoditve termina."
          />

          <PolicyBlock
            title="5. Obseg storitve"
            text="Storitev se izvaja na podlagi podatkov, ki jih stranka vnese ob rezervaciji. Če se dejansko stanje bistveno razlikuje od navedenega ob rezervaciji, se lahko obseg storitve ali končna cena ustrezno prilagodi."
          />

          <PolicyBlock
            title="6. Odgovornost uporabnika"
            text="Uporabnik je odgovoren za točnost posredovanih podatkov, dostop do lokacije čiščenja ter pravočasno obvestilo o posebnih pogojih ali navodilih."
          />

          <PolicyBlock
            title="7. Omejitev odgovornosti"
            text="Cleanix si prizadeva za točnost informacij na spletni strani, vendar ne more jamčiti, da bodo vse informacije vedno popolne ali brez napak. Prav tako si pridržujemo pravico do sprememb storitev, cen ali vsebine strani brez predhodnega obvestila."
          />

          <PolicyBlock
            title="8. Kontakt"
            text="Za vprašanja glede pogojev uporabe nas lahko kontaktirate na info@cleanix.si ali na telefonsko številko 069 665 229."
          />

          <div className="rounded-2xl bg-[#f8f5ef] p-5 text-sm text-[#5d716a]">
            Zadnja posodobitev: August 1, 2026
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