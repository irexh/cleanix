"use server";

import {revalidatePath} from "next/cache";
import {prisma} from "@/lib/prisma";

async function updateStatus(id: string, bookingStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
  await prisma.booking.update({where: {id}, data: {bookingStatus}});
  revalidatePath("/[locale]/admin", "page");
}

export const confirmBooking = (id: string) => updateStatus(id, "CONFIRMED");
export const completeBooking = (id: string) => updateStatus(id, "COMPLETED");
export const cancelBooking = (id: string) => updateStatus(id, "CANCELLED");

export async function deleteBooking(id: string) {
  await prisma.booking.delete({where: {id}});
  revalidatePath("/[locale]/admin", "page");
}
