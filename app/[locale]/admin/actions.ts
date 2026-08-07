"use server";

import {revalidatePath} from "next/cache";
import {prisma} from "@/lib/prisma";

async function updateStatus(id: string, bookingStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
  await prisma.booking.update({where: {id}, data: {bookingStatus}});
  revalidatePath("/[locale]/admin", "page");
}

export async function confirmBooking(id: string) {
  return updateStatus(id, "CONFIRMED");
}

export async function completeBooking(id: string) {
  return updateStatus(id, "COMPLETED");
}

export async function cancelBooking(id: string) {
  return updateStatus(id, "CANCELLED");
}

export async function deleteBooking(id: string) {
  await prisma.booking.delete({where: {id}});
  revalidatePath("/[locale]/admin", "page");
}

export async function deleteBookingAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Missing booking id");
  }

  await deleteBooking(id);
}
