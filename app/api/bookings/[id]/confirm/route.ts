import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Props
) {
  const { id } = await params;

  await prisma.booking.update({
    where: {
      id,
    },
    data: {
      bookingStatus: "CONFIRMED",
    },
  });

  return NextResponse.json({
    success: true,
  });
}