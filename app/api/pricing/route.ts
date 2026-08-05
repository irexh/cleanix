import {NextRequest, NextResponse} from "next/server";

import {calculatePrice} from "@/lib/pricing";
import {getBookingPrice} from "@/lib/sale-pricing";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  try {
    const price = await getBookingPrice({
      propertySize: body.propertySize,
      bathrooms: Number(body.bathrooms ?? 1),
      extras: body.extras ?? [],
      frequency: body.frequency,
      duration: body.duration,
      selectedDate: body.selectedDate
    });

    return NextResponse.json({success: true, ...price});
  } catch (error) {
    console.error("PRICING ERROR:", error);

    return NextResponse.json({
      success: true,
      totalPrice: calculatePrice(
        body.propertySize,
        Number(body.bathrooms ?? 1),
        body.extras ?? [],
        body.frequency,
        body.duration
      ),
      saleActive: false
    });
  }
}
