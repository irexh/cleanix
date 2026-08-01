import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { bookingStatus } = await req.json();

    const booking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        bookingStatus,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}