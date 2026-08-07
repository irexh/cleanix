import {NextRequest, NextResponse} from "next/server";

import {auth} from "@/auth";
import {sendBookingStatusEmail} from "@/lib/booking-email";
import {prisma} from "@/lib/prisma";

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED"
] as const;

export async function PATCH(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({error: "Niste prijavljeni."}, {status: 401});
  }

  const adminUser = await prisma.user.findUnique({
    where: {email: session.user.email},
    select: {role: true}
  });

  if (adminUser?.role !== "ADMIN") {
    return NextResponse.json({error: "Nimate dovoljenja."}, {status: 403});
  }

  const {id} = await context.params;
  const body = await request.json();
  const nextStatus = body?.status;

  if (!allowedStatuses.includes(nextStatus)) {
    return NextResponse.json({error: "Neveljaven status."}, {status: 400});
  }

  const existingBooking = await prisma.booking.findUnique({
    where: {id}
  });

  if (!existingBooking) {
    return NextResponse.json({error: "Rezervacija ne obstaja."}, {status: 404});
  }

  const updatedBooking = await prisma.booking.update({
    where: {id},
    data: {bookingStatus: nextStatus}
  });

  if (
    existingBooking.bookingStatus !== nextStatus &&
    (nextStatus === "CONFIRMED" || nextStatus === "CANCELLED")
  ) {
    try {
      await sendBookingStatusEmail(nextStatus, updatedBooking);
    } catch (error) {
      console.error("BOOKING STATUS EMAIL ERROR:", error);
    }
  }

  return NextResponse.json({
    success: true,
    booking: updatedBooking
  });
}

export async function DELETE(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({error: "Niste prijavljeni."}, {status: 401});
  }

  const adminUser = await prisma.user.findUnique({
    where: {email: session.user.email},
    select: {role: true}
  });

  if (adminUser?.role !== "ADMIN") {
    return NextResponse.json({error: "Nimate dovoljenja."}, {status: 403});
  }

  const {id} = await context.params;

  const existingBooking = await prisma.booking.findUnique({
    where: {id}
  });

  if (!existingBooking) {
    return NextResponse.json({error: "Rezervacija ne obstaja."}, {status: 404});
  }

  await prisma.booking.delete({where: {id}});

  return NextResponse.json({success: true});
}
