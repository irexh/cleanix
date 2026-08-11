"use server";

import {revalidatePath} from "next/cache";

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";

export async function claimBookingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Niste prijavljeni.");
  }

  const bookingId = String(formData.get("bookingId") ?? "");

  if (!bookingId) {
    throw new Error("Manjka booking id.");
  }

  const employee = await prisma.employee.findFirst({
    where: {
      email: session.user.email,
      isActive: true
    },
    select: {id: true}
  });

  if (!employee) {
    throw new Error("Zaposleni profil ni povezan s tem računom.");
  }

  const booking = await prisma.booking.findUnique({
    where: {id: bookingId},
    select: {employeeId: true}
  });

  if (!booking) {
    throw new Error("Nalog ne obstaja.");
  }

  if (booking.employeeId && booking.employeeId !== employee.id) {
    throw new Error("Ta nalog je že prevzel drug zaposleni.");
  }

  await prisma.booking.update({
    where: {id: bookingId},
    data: {
      employeeId: employee.id
    }
  });

  revalidatePath("/sl/employee");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}
