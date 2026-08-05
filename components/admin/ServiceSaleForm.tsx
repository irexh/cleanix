"use client";

const regularPrices: Record<string, number> = {
  "Do 40 m²": 55,
  "41–60 m²": 70,
  "61–80 m²": 85,
  "81–100 m²": 99,
  "101–150 m²": 129,
  "151 m² ali več": 149
};

function priceForFrequency(basePrice: number, frequency: string) {
  if (frequency === "NA_DVA_TEDNA") return Math.round(basePrice * 0.9);
  if (frequency === "MESECNO") return Math.round(basePrice * 0.95);
  return basePrice;
}

export default function ServiceSaleForm({
  action,
  sizeOptions,
  frequencyOptions,
  durationOptions
}: {
  action: (formData: FormData) => void;
  sizeOptions: string[];
  frequencyOptions: {value: string; label: string}[];
  durationOptions: {value: string; label: string}[];
}) {
  function updateSuggestedPrice(form: HTMLFormElement) {
    const size = String(new FormData(form).get("sizeRange") ?? "");
    const frequency = String(new FormData(form).get("frequency") ?? "");
    const input = form.elements.namedItem("regularPrice") as HTMLInputElement | null;
    const basePrice = regularPrices[size] ?? 0;

    if (input && basePrice > 0) {
      input.value = String(priceForFrequency(basePrice, frequency));
    }
  }

  return (
    <form
      action={action}
      onChange={(event) => updateSuggestedPrice(event.currentTarget)}
      className="mt-7 grid gap-5 lg:grid-cols-3"
    >
      <label className="grid gap-2 text-sm font-bold">
        Velikost
        <select name="sizeRange" className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#2f6fe4]">
          {sizeOptions.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Pogostost
        <select name="frequency" className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#2f6fe4]">
          {frequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Trajanje
        <select name="duration" className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#2f6fe4]">
          {durationOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Redna cena
        <input
          name="regularPrice"
          type="number"
          min="0"
          required
          defaultValue={55}
          className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#2f6fe4]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Akcijska cena
        <input
          name="salePrice"
          type="number"
          min="0"
          placeholder="npr. 45"
          className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#2f6fe4]"
        />
      </label>

      <label className="flex items-center gap-3 rounded-xl bg-[#f6f9ff] px-4 py-3 text-sm font-bold lg:mt-7">
        <input name="isActive" type="checkbox" defaultChecked />
        Aktivno
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Akcija od
        <input name="saleStartsAt" type="date" className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#2f6fe4]" />
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Akcija do
        <input name="saleEndsAt" type="date" className="rounded-xl border border-[#dbe7fb] px-4 py-3 outline-none focus:border-[#2f6fe4]" />
      </label>

      <button type="submit" className="rounded-full bg-[#2f6fe4] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#215ac0] lg:mt-7">
        Shrani akcijo
      </button>
    </form>
  );
}
