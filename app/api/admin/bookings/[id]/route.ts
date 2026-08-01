import {NextRequest, NextResponse} from "next/server";

import {auth} from "@/auth";
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

  const updatedBooking = await prisma.booking.update({
    where: {id},
    data: {bookingStatus: nextStatus}
  });

  return NextResponse.json({
    success: true,
    booking: updatedBooking
  });
}