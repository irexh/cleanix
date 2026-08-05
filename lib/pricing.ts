export const sizePrices: Record<string, number> = {
  "Do 40 m²": 55,
  "41–60 m²": 70,
  "61–80 m²": 85,
  "81–100 m²": 99,
  "101–150 m²": 129,
  "151 m² ali več": 149
};

export const extraPrices: Record<string, number> = {
  "Globinsko čiščenje": 40,
  "Čiščenje pečice": 15,
  "Čiščenje hladilnika": 15,
  "Čiščenje oken": 20,
  Balkon: 15,
};

export function calculatePrice(
  size: string,
  bathrooms: number,
  extras: string[] = [],
  frequency = "ENKRATNO",
  duration = ""
) {
  const basePrice = sizePrices[size] ?? 0;
  const bathroomPrice = Math.max(0, bathrooms - 1) * 12;

  const extrasPrice = extras.reduce(
    (total, extra) => total + (extraPrices[extra] ?? 0),
    0
  );

  let subtotal = basePrice + bathroomPrice + extrasPrice;

  if (frequency === "NA_DVA_TEDNA") {
    subtotal = Math.round(subtotal * 0.9);
  }

  if (frequency === "MESECNO") {
    subtotal = Math.round(subtotal * 0.95);
  }

  if (duration === "3 mesece") {
    subtotal = Math.round(subtotal * 0.97);
  }

  if (duration === "6 mesecev") {
    subtotal = Math.round(subtotal * 0.94);
  }

  if (duration === "12 mesecev") {
    subtotal = Math.round(subtotal * 0.9);
  }

  return subtotal;
}
