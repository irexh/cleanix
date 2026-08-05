"use server";

import {revalidatePath} from "next/cache";

import {galleryPrisma} from "@/lib/gallery-prisma";
import {siteContentPrisma} from "@/lib/site-content";

function cleanImagePath(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function updateHeroImagesAction(formData: FormData) {
  const homeHeroImage = cleanImagePath(formData.get("home_hero_image"));
  const businessHeroImage = cleanImagePath(formData.get("business_hero_image"));

  if (homeHeroImage) {
    await siteContentPrisma.siteContent.upsert({
      where: {key: "home_hero_image"},
      update: {
        label: "Homepage - hero slika",
        value: homeHeroImage
      },
      create: {
        key: "home_hero_image",
        label: "Homepage - hero slika",
        value: homeHeroImage
      }
    });
  }

  if (businessHeroImage) {
    await siteContentPrisma.siteContent.upsert({
      where: {key: "business_hero_image"},
      update: {
        label: "Business - hero slika",
        value: businessHeroImage
      },
      create: {
        key: "business_hero_image",
        label: "Business - hero slika",
        value: businessHeroImage
      }
    });
  }

  revalidatePath("/sl/admin/gallery");
  revalidatePath("/sl");
  revalidatePath("/sl/business");
}

export async function addGalleryImageAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const src = cleanImagePath(formData.get("src"));

  if (!title || !src) {
    throw new Error("Title and image path are required");
  }

  await galleryPrisma.galleryImage.create({
    data: {
      title,
      src,
      isActive: true
    }
  });

  revalidatePath("/sl/admin/gallery");
  revalidatePath("/sl");
}

export async function deleteGalleryImageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Missing image id");
  }

  await galleryPrisma.galleryImage.delete({
    where: {id}
  });

  revalidatePath("/sl/admin/gallery");
  revalidatePath("/sl");
}
