"use client";

import {useMemo, useState} from "react";

import {calculatePrice} from "@/lib/pricing";

const cities = [
  {name: "Ljubljana", available: true},
  {name: "Maribor", available: false},
  {name: "Celje", available: false},
  {name: "Kranj", available: false},
  {name: "Koper", available: false}
];

const propertyTypes = ["Stanovanje", "Hiša", "Poslovni prostor"];

const sizes = [
  "Do 40 m²",
  "41–60 m²",
  "61–80 m²",
  "81–100 m²",
  "101–150 m²",
  "151 m² ali več"
];

const extrasList = [
  "Globinsko čiščenje",
  "Čiščenje pečice",
  "Čiščenje hladilnika",
  "Čiščenje oken",
  "Balkon",
];

const frequencyOptions = [
  {value: "ENKRATNO", label: "1x enkratno čiščenje"},
  {value: "NA_DVA_TEDNA", label: "1x na dva tedna"},
  {value: "MESECNO", label: "1x na mesec"}
] as const;

const durationOptions = ["3 mesece", "6 mesecev", "12 mesecev"];

const times = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00"
];

type FrequencyValue = (typeof frequencyOptions)[number]["value"];

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [bathrooms, setBathrooms] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<FrequencyValue>("ENKRATNO");
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showDuration = frequency !== "ENKRATNO";
  const frequencyLabel =
    frequencyOptions.find((item) => item.value === frequency)?.label ?? "";

 const totalPrice = useMemo(
  () => calculatePrice(propertySize, bathrooms, extras, frequency, duration),
  [propertySize, bathrooms, extras, frequency, duration]
);

  const totalSteps = 9;

  const canContinue =
    (step === 1 && Boolean(city)) ||
    (step === 2 && Boolean(propertyType)) ||
    (step === 3 && Boolean(propertySize)) ||
    step === 4 ||
    step === 5 ||
    (step === 6 && Boolean(frequency) && (!showDuration || Boolean(duration))) ||
    (step === 7 && Boolean(selectedDate) && Boolean(selectedTime)) ||
    (step === 8 &&
      Boolean(fullName.trim()) &&
      Boolean(email.trim()) &&
      Boolean(phone.trim()) &&
      Boolean(address.trim()));

  const toggleExtra = (extra: string) => {
    setExtras((current) =>
      current.includes(extra)
        ? current.filter((item) => item !== extra)
        : [...current, extra]
    );
  };

  const handleFrequencyChange = (value: FrequencyValue) => {
    setFrequency(value);

    if (value === "ENKRATNO") {
      setDuration("");
    }
  };

  const handleInquiry = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          totalPrice,
          city,
          propertyType,
          propertySize,
          bathrooms,
          extras,
          frequency: frequencyLabel,
          duration,
          selectedDate,
          selectedTime,
          fullName,
          email,
          phone,
          address,
          notes
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Povpraševanja ni bilo mogoče poslati.");
      }

      setIsSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Prišlo je do napake. Poskusite znova."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <p className="mb-3 text-sm font-bold tracking-[0.16em] text-[#2f6fe4]">
            POVPRAŠEVANJE USPEŠNO POSLANO
          </p>
          <h2 className="text-4xl font-bold text-[#123b7a]">
            Hvala za vaše povpraševanje.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5d716a]">
            Vašo zahtevo smo prejeli. Kmalu vas bomo kontaktirali za potrditev
            termina in uskladitev vseh podrobnosti.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#123b7a] px-7 py-3 font-bold text-white shadow-sm transition hover:bg-[#0d2f63]"
            >
              Nazaj domov
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#123b7a] px-7 py-3 font-bold text-[#123b7a] transition hover:bg-[#123b7a] hover:text-white"
            >
              Kontakt
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-10">
          <div className="mb-10">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold text-[#2f6fe4]">
              <span>Korak {step} od {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)} %</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#eaf2ff]">
              <div
                className="h-full rounded-full bg-[#2f6fe4] transition-all"
                style={{width: `${(step / totalSteps) * 100}%`}}
              />
            </div>
          </div>

          {step === 1 && (
            <Step
              title="Kje potrebujete čiščenje?"
              description="Izberite mesto, kjer se nahaja vaš dom."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {cities.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    disabled={!item.available}
                    onClick={() => item.available && setCity(item.name)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left font-semibold transition ${
                      item.available
                        ? city === item.name
                          ? "border-[#2f6fe4] bg-[#eaf2ff] text-[#123b7a]"
                          : "border-gray-200 bg-white hover:border-[#9ebeff]"
                        : "cursor-not-allowed border-[#e7dfd2] bg-[#f6f1e8] text-[#9b9388] opacity-90"
                    }`}
                  >
                    <span>{item.name}</span>

                    {!item.available ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#c47d4d] shadow-sm">
                        kmalu
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step
              title="Za kakšen prostor gre?"
              description="To nam pomaga pripraviti pravo ekipo in opremo."
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {propertyTypes.map((item) => (
                  <ChoiceButton
                    key={item}
                    active={propertyType === item}
                    onClick={() => setPropertyType(item)}
                  >
                    {item}
                  </ChoiceButton>
                ))}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step
              title="Kako velik je prostor?"
              description="Izberite približno velikost prostora."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {sizes.map((item) => (
                  <ChoiceButton
                    key={item}
                    active={propertySize === item}
                    onClick={() => setPropertySize(item)}
                  >
                    {item}
                  </ChoiceButton>
                ))}
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step
              title="Koliko kopalnic imate?"
              description="Cena vključuje eno kopalnico."
            >
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setBathrooms((value) => Math.max(1, value - 1))}
                  className="grid h-12 w-12 place-items-center rounded-full border text-2xl font-bold hover:bg-[#eaf2ff]"
                >
                  -
                </button>

                <span className="w-16 text-center text-3xl font-bold">
                  {bathrooms}
                </span>

                <button
                  type="button"
                  onClick={() => setBathrooms((value) => Math.min(10, value + 1))}
                  className="grid h-12 w-12 place-items-center rounded-full border text-2xl font-bold hover:bg-[#eaf2ff]"
                >
                  +
                </button>
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step
              title="Želite dodati kaj posebnega?"
              description="Te storitve so neobvezne."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {extrasList.map((item) => (
                  <ChoiceButton
                    key={item}
                    active={extras.includes(item)}
                    onClick={() => toggleExtra(item)}
                  >
                    {extras.includes(item) ? "✓ " : ""}
                    {item}
                  </ChoiceButton>
                ))}
              </div>
            </Step>
          )}

          {step === 6 && (
            <Step
              title="Kako pogosto potrebujete čiščenje?"
              description="Izberite enkratni ali redni termin."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {frequencyOptions.map((item) => (
                  <ChoiceButton
                    key={item.value}
                    active={frequency === item.value}
                    onClick={() => handleFrequencyChange(item.value)}
                  >
                    {item.label}
                  </ChoiceButton>
                ))}
              </div>

              {showDuration ? (
                <div className="mt-8">
                  <p className="mb-3 text-sm font-bold">Trajanje sodelovanja</p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {durationOptions.map((item) => (
                      <ChoiceButton
                        key={item}
                        active={duration === item}
                        onClick={() => setDuration(item)}
                      >
                        {item}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl bg-[#f6f9ff] p-4 text-sm text-[#5d716a]">
                {frequency === "NA_DVA_TEDNA" ? (
                  <p>Pri rezervaciji na 2 tedna je v ceno že vključen 10 % popust.</p>
                ) : frequency === "MESECNO" ? (
                  <p>Pri mesečnem čiščenju je v ceno že vključen 5 % popust.</p>
                ) : (
                  <p>Izbrali ste enkratno čiščenje brez vezave.</p>
                )}
              </div>
            </Step>
          )}

          {step === 7 && (
            <Step
              title="Izberite termin"
              description="Izberite datum in uro, ki vam najbolj ustrezata."
            >
              <div className="mb-7">
                <label className="mb-2 block text-sm font-bold">Datum</label>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#2f6fe4]"
                />
              </div>

              <p className="mb-3 text-sm font-bold">Ura prihoda</p>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {times.map((time) => (
                  <ChoiceButton
                    key={time}
                    active={selectedTime === time}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </ChoiceButton>
                ))}
              </div>
            </Step>
          )}

          {step === 8 && (
            <Step
              title="Vaši podatki"
              description="Potrebujemo jih za potrditev povpraševanja."
            >
              <div className="grid gap-5">
                <Field label="Ime in priimek">
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="form-input"
                    placeholder="Janez Novak"
                  />
                </Field>

                <Field label="E-poštni naslov">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="form-input"
                    placeholder="ime@primer.si"
                  />
                </Field>

                <Field label="Telefonska številka">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="form-input"
                    placeholder="+386 40 123 456"
                  />
                </Field>

                <Field label="Naslov čiščenja">
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="form-input"
                    placeholder="Ulica, poštna številka, mesto"
                  />
                </Field>

                <Field label="Opomba za ekipo (neobvezno)">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="form-input min-h-28 resize-y"
                    placeholder="Posebna navodila ali želje"
                  />
                </Field>
              </div>
            </Step>
          )}

          {step === 9 && (
            <Step
              title="Preverite povpraševanje"
              description="Po oddaji vas bomo kmalu kontaktirali za potrditev termina."
            >
              <div className="rounded-2xl bg-[#eaf2ff] p-6">
                <p className="text-sm text-[#5d716a]">Predvidena cena na obisk</p>
                <p className="mt-1 text-4xl font-bold text-[#123b7a]">
                  €{totalPrice}
                </p>
              </div>

              {error ? (
                <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </Step>
          )}

          <div className="mt-10 flex items-center justify-between gap-4 border-t pt-6">
            <button
              type="button"
              disabled={step === 1 || isLoading}
              onClick={() => setStep((current) => current - 1)}
              className="rounded-full px-5 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Nazaj
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep((current) => current + 1)}
                className="rounded-full bg-[#2f6fe4] px-6 py-3 font-bold text-white transition hover:bg-[#215ac0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Nadaljuj →
              </button>
            ) : (
              <button
                type="button"
                disabled={isLoading || totalPrice === 0}
                onClick={handleInquiry}
                className="rounded-full bg-[#4d8dff] px-6 py-3 font-bold text-white transition hover:bg-[#2f6fe4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? "Pošiljamo povpraševanje ..." : "Pošlji povpraševanje"}
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-3xl bg-[#123b7a] p-7 text-white lg:sticky lg:top-8">
          <p className="mb-5 text-sm font-bold tracking-wider text-[#c8dbff]">
            POVZETEK REZERVACIJE
          </p>

          <SummaryRow label="Mesto" value={city} />
          <SummaryRow label="Prostor" value={propertyType} />
          <SummaryRow label="Velikost" value={propertySize} />
          <SummaryRow
            label="Kopalnice"
            value={propertySize ? String(bathrooms) : ""}
          />
          <SummaryRow label="Pogostost" value={frequencyLabel} />
          <SummaryRow label="Trajanje" value={showDuration ? duration : ""} />
          <SummaryRow label="Datum" value={selectedDate} />
          <SummaryRow label="Ura" value={selectedTime} />

          {extras.length > 0 ? (
            <div className="border-t border-[#5f86cf] py-4">
              <p className="mb-2 text-sm font-semibold text-[#c8dbff]">
                Dodatne storitve
              </p>
              {extras.map((extra) => (
                <p key={extra} className="mb-1 text-sm">
                  ✓ {extra}
                </p>
              ))}
            </div>
          ) : null}

          <div className="mt-4 border-t border-[#5f86cf] pt-5">
            <p className="text-sm text-[#c8dbff]">Predvidena cena na obisk</p>
            <p className="text-3xl font-bold">€{totalPrice}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Step({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#123b7a]">{title}</h2>
      <p className="mb-8 mt-3 text-[#5d716a]">{description}</p>
      {children}
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${
        active
          ? "border-[#2f6fe4] bg-[#eaf2ff] text-[#123b7a]"
          : "border-gray-200 bg-white hover:border-[#9ebeff]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({label, value}: {label: string; value: string}) {
  if (!value) return null;

  return (
    <div className="flex justify-between gap-4 border-b border-[#5f86cf] py-3 text-sm">
      <span className="text-[#c8dbff]">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
