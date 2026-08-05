"use server";

import {revalidatePath} from "next/cache";

import {prisma} from "@/lib/prisma";

export async function assignEmployeeToBookingAction(formData: FormData) {
  const bookingId = String(formData.get("bookingId") ?? "");
  const employeeIdValue = String(formData.get("employeeId") ?? "");
  const employeeId = employeeIdValue === "UNASSIGNED" ? null : employeeIdValue;

  if (!bookingId) {
    throw new Error("Missing booking id");
  }

  await prisma.booking.update({
    where: {id: bookingId},
    data: {employeeId}
  });

  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
  revalidatePath(`/sl/admin/bookings/${bookingId}`);
}
