"use server";

import {revalidatePath} from "next/cache";

import {servicePricePrisma} from "@/lib/service-price-prisma";

export async function saveServicePriceAction(formData: FormData) {
  const serviceKey = String(formData.get("serviceKey") ?? "HOME_CLEANING");
  const serviceName = String(formData.get("serviceName") ?? "Čiščenje doma");
  const propertyType = String(formData.get("propertyType") ?? "Stanovanje");
  const sizeRange = String(formData.get("sizeRange") ?? "");
  const frequency = String(formData.get("frequency") ?? "");
  const duration = String(formData.get("duration") ?? "");
  const priceFrequency = duration ? `${frequency}__${duration}` : frequency;
  const regularPrice = Number(formData.get("regularPrice") ?? 0);
  const salePriceValue = String(formData.get("salePrice") ?? "").trim();
  const saleStartsAt = String(formData.get("saleStartsAt") ?? "").trim();
  const saleEndsAt = String(formData.get("saleEndsAt") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!sizeRange || !frequency || !Number.isFinite(regularPrice) || regularPrice < 0) {
    throw new Error("Invalid price data");
  }

  const salePrice =
    salePriceValue.length > 0 && Number.isFinite(Number(salePriceValue))
      ? Number(salePriceValue)
      : null;

  if (
    serviceKey === "BUSINESS_CONTRACT" &&
    (salePrice === null || salePrice < 1 || salePrice > 100)
  ) {
    throw new Error("Business popust mora biti med 1 in 100");
  }

  await servicePricePrisma.servicePrice.upsert({
    where: {
      serviceKey_propertyType_sizeRange_frequency: {
        serviceKey,
        propertyType,
        sizeRange,
        frequency: priceFrequency
      }
    },
    update: {
      regularPrice,
      salePrice,
      saleStartsAt: saleStartsAt || null,
      saleEndsAt: saleEndsAt || null,
      isActive
    },
    create: {
      serviceKey,
      serviceName,
      propertyType,
      sizeRange,
      frequency: priceFrequency,
      regularPrice,
      salePrice,
      saleStartsAt: saleStartsAt || null,
      saleEndsAt: saleEndsAt || null,
      isActive
    }
  });

  revalidatePath("/sl/admin/services");
  revalidatePath("/sl");
  revalidatePath("/sl/business");
  revalidatePath("/sl/booking");
}

export async function toggleServicePriceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "on";

  if (!id) throw new Error("Missing price id");

  await servicePricePrisma.servicePrice.update({
    where: {id},
    data: {isActive}
  });

  revalidatePath("/sl/admin/services");
  revalidatePath("/sl");
  revalidatePath("/sl/business");
  revalidatePath("/sl/booking");
}

export async function deleteServicePriceAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("Missing price id");

  await servicePricePrisma.servicePrice.delete({
    where: {id}
  });

  revalidatePath("/sl/admin/services");
  revalidatePath("/sl");
  revalidatePath("/sl/business");
  revalidatePath("/sl/booking");
}
