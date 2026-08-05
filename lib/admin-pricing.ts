import {sizePrices} from "@/lib/pricing";
import {servicePricePrisma} from "@/lib/service-price-prisma";

const frequencies = [
  {key: "ENKRATNO", label: "1x enkratno čiščenje"},
  {key: "NA_DVA_TEDNA", label: "1x na dva tedna"},
  {key: "MESECNO", label: "1x na mesec"}
];

function defaultPriceForFrequency(basePrice: number, frequency: string) {
  if (frequency === "NA_DVA_TEDNA") {
    return Math.round(basePrice * 0.9);
  }

  if (frequency === "MESECNO") {
    return Math.round(basePrice * 0.95);
  }

  return basePrice;
}

export async function ensureDefaultServicePrices() {
  const existingCount = await servicePricePrisma.servicePrice.count();

  if (existingCount > 0) {
    return;
  }

  const data = Object.entries(sizePrices).flatMap(([sizeRange, basePrice]) =>
    frequencies.map((frequency) => ({
      serviceKey: "HOME_CLEANING",
      serviceName: "Čiščenje doma",
      propertyType: "Stanovanje",
      sizeRange,
      frequency: frequency.key,
      regularPrice: defaultPriceForFrequency(basePrice, frequency.key),
      isActive: true
    }))
  );

  await servicePricePrisma.servicePrice.createMany({
    data,
    skipDuplicates: true
  });
}
