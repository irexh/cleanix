import {prisma} from "@/lib/prisma";
import {calculatePrice, extraPrices} from "@/lib/pricing";

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function isDateInsideSale(
  date: string,
  saleStartsAt: string | null,
  saleEndsAt: string | null
) {
  if (!date) return false;
  if (saleStartsAt && date < saleStartsAt) return false;
  if (saleEndsAt && date > saleEndsAt) return false;
  return true;
}

function applyDurationDiscount(price: number, duration = "") {
  if (duration === "3 mesece") return Math.round(price * 0.97);
  if (duration === "6 mesecev") return Math.round(price * 0.94);
  if (duration === "12 mesecev") return Math.round(price * 0.9);
  return price;
}

export async function getBookingPrice({
  propertySize,
  bathrooms,
  extras = [],
  frequency = "ENKRATNO",
  duration = "",
  selectedDate = todayIso()
}: {
  propertySize: string;
  bathrooms: number;
  extras?: string[];
  frequency?: string;
  duration?: string;
  selectedDate?: string;
}) {
  const priceFrequency = duration ? `${frequency}__${duration}` : frequency;

  const dbPrice = await prisma.servicePrice.findFirst({
    where: {
      sizeRange: propertySize,
      frequency: priceFrequency,
      isActive: true
    }
  }) ?? await prisma.servicePrice.findFirst({
    where: {
      sizeRange: propertySize,
      frequency,
      isActive: true
    }
  });

  if (!dbPrice) {
    return {
      totalPrice: calculatePrice(propertySize, bathrooms, extras, frequency, duration),
      regularPrice: null,
      salePrice: null,
      saleActive: false
    };
  }

  const bathroomPrice = Math.max(0, bathrooms - 1) * 12;
  const extrasPrice = extras.reduce(
    (total, extra) => total + (extraPrices[extra] ?? 0),
    0
  );
  const basePrice =
    dbPrice.salePrice !== null &&
    isDateInsideSale(selectedDate, dbPrice.saleStartsAt, dbPrice.saleEndsAt)
      ? dbPrice.salePrice
      : dbPrice.regularPrice;

  const totalPrice = applyDurationDiscount(
    basePrice + bathroomPrice + extrasPrice,
    duration
  );

  return {
    totalPrice,
    regularPrice: dbPrice.regularPrice,
    salePrice: dbPrice.salePrice,
    saleActive: basePrice === dbPrice.salePrice && dbPrice.salePrice !== null
  };
}

export async function getActiveHomepageSale() {
  const today = todayIso();

  return prisma.servicePrice.findFirst({
    where: {
      serviceKey: "HOME_CLEANING",
      isActive: true,
      salePrice: {not: null},
      OR: [{saleStartsAt: null}, {saleStartsAt: {lte: today}}],
      AND: [
        {
          OR: [{saleEndsAt: null}, {saleEndsAt: {gte: today}}]
        }
      ]
    },
    orderBy: {updatedAt: "desc"}
  });
}

export async function getActiveHomepageSales() {
  const today = todayIso();

  return prisma.servicePrice.findMany({
    where: {
      isActive: true,
      salePrice: {not: null},
      serviceKey: {in: ["HOME_CLEANING", "BUSINESS_CONTRACT"]},
      OR: [{saleStartsAt: null}, {saleStartsAt: {lte: today}}],
      AND: [
        {
          OR: [{saleEndsAt: null}, {saleEndsAt: {gte: today}}]
        }
      ]
    },
    orderBy: {updatedAt: "desc"}
  });
}

export async function getActiveBusinessSale() {
  const today = todayIso();

  return prisma.servicePrice.findFirst({
    where: {
      serviceKey: "BUSINESS_CONTRACT",
      isActive: true,
      salePrice: {not: null},
      OR: [{saleStartsAt: null}, {saleStartsAt: {lte: today}}],
      AND: [
        {
          OR: [{saleEndsAt: null}, {saleEndsAt: {gte: today}}]
        }
      ]
    },
    orderBy: {updatedAt: "desc"}
  });
}
