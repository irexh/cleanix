const sizePrices: Record<string, number> = {
  "Do 40 m²": 55,
  "41–60 m²": 70,
  "61–80 m²": 90,
  "81–100 m²": 110,
  "101–150 m²": 140,
  "151 m² ali več": 170
};

const extraPrices: Record<string, number> = {
  "Globinsko čiščenje": 35,
  "Čiščenje pečice": 15,
  "Čiščenje hladilnika": 12,
  "Čiščenje oken": 20,
  Balkon: 15,
  Likanje: 18
};

export function calculatePrice(
  size: string,
  bathrooms: number,
  extras: string[] = []
) {
  const basePrice = sizePrices[size] ?? 0;
  const bathroomPrice = Math.max(0, bathrooms - 1) * 12;

  const extrasPrice = extras.reduce(
    (total, extra) => total + (extraPrices[extra] ?? 0),
    0
  );

  return basePrice + bathroomPrice + extrasPrice;
}