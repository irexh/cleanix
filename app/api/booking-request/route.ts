import {NextRequest, NextResponse} from "next/server";

import {prisma} from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const {
      totalPrice,
      city,
      propertyType,
      propertySize,
      bathrooms,
      extras,
      frequency,
      duration,
      selectedDate,
      selectedTime,
      fullName,
      email,
      phone,
      address,
      notes
    } = await request.json();

    const bookingNotes = [
      notes?.trim() || "",
      frequency ? `Pogostost: ${frequency}` : "",
      duration ? `Trajanje: ${duration}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.booking.create({
      data: {
        fullName,
        email,
        phone,
        address,
        city,
        propertyType,
        propertySize,
        bathrooms: Number(bathrooms),
        extras: JSON.stringify(extras ?? []),
        selectedDate,
        selectedTime,
        totalPrice: Number(totalPrice),
        notes: bookingNotes,
        paymentStatus: "PENDING",
        bookingStatus: "PENDING"
      }
    });

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("BOOKING REQUEST ERROR:", error);

    return NextResponse.json(
      {success: false, error: "Napaka pri pošiljanju povpraševanja."},
      {status: 500}
    );
  }
}
