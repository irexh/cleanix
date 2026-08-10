"use server";

import bcrypt from "bcryptjs";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

import {prisma} from "@/lib/prisma";

type RegisterState = {
  error?: string;
};

export async function registerCustomerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password || !confirmPassword) {
    return {error: "Izpolni vsa polja."};
  }

  if (password.length < 6) {
    return {error: "Geslo mora imeti vsaj 6 znakov."};
  }

  if (password !== confirmPassword) {
    return {error: "Gesli se ne ujemata."};
  }

  const existingUser = await prisma.user.findUnique({
    where: {email}
  });

  if (existingUser) {
    return {error: "Ta e-poštni naslov je že registriran."};
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: "CUSTOMER"
    }
  });

  revalidatePath("/sl/login");
  redirect("/sl/login?registered=1");
}
