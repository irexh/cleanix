"use server";

import {revalidatePath} from "next/cache";

import {defaultSiteContent, siteContentPrisma} from "@/lib/site-content";

export async function updateSiteContentAction(formData: FormData) {
  await Promise.all(
    defaultSiteContent.map((item) => {
      const value = String(formData.get(item.key) ?? "").trim();

      return siteContentPrisma.siteContent.upsert({
        where: {key: item.key},
        update: {
          label: item.label,
          value: value || item.value
        },
        create: {
          key: item.key,
          label: item.label,
          value: value || item.value
        }
      });
    })
  );

  revalidatePath("/sl/admin/content");
  revalidatePath("/sl");
  revalidatePath("/sl/business");
}
