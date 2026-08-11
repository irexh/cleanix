"use server";

import {revalidatePath} from "next/cache";

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";

export type ProfileSettingsState = {
  success: boolean;
  message: string;
};

const initialState: ProfileSettingsState = {
  success: false,
  message: ""
};

export async function updateProfileSettings(
  _prevState: ProfileSettingsState = initialState,
  formData: FormData
): Promise<ProfileSettingsState> {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      success: false,
      message: "Seja je potekla. Prijavite se znova."
    };
  }

  const currentEmail = session.user.email;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email) {
    return {
      success: false,
      message: "Ime in e-pošta sta obvezna."
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {email}
  });

  if (existingUser && existingUser.email !== currentEmail) {
    return {
      success: false,
      message: "Ta e-poštni naslov je že v uporabi."
    };
  }

  await prisma.user.update({
    where: {email: currentEmail},
    data: {
      name,
      email
    }
  });

  await prisma.booking.updateMany({
    where: {email: currentEmail},
    data: {
      email,
      fullName: name,
      ...(phone ? {phone} : {})
    }
  });

  revalidatePath("/sl/profile");
  revalidatePath("/sl");
  revalidatePath("/sl/booking");

  return {
    success: true,
    message:
      email !== currentEmail
        ? "Podatki so shranjeni. Po spremembi e-pošte se za vsak primer prijavite znova."
        : "Podatki so uspešno shranjeni."
  };
}
