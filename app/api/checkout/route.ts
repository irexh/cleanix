import {NextRequest, NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const {
      totalPrice,
      city,
      propertyType,
      propertySize,
      bathrooms,
      extras,
      selectedDate,
      selectedTime,
      fullName,
      email,
      phone,
      address,
      notes,
      locale
    } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(Number(totalPrice) * 100),
            product_data: {
              name: "Čisto Cleaning Service"
            }
          }
        }
      ],
      success_url: `${req.nextUrl.origin}${locale === "en" ? "/en" : ""}/success`,
      cancel_url: `${req.nextUrl.origin}${locale === "en" ? "/en" : ""}/cancel`,
      metadata: {
        city,
        propertyType,
        propertySize,
        bathrooms: String(bathrooms),
        extras: JSON.stringify(extras),
        selectedDate,
        selectedTime,
        fullName,
        email,
        phone,
        address,
        notes: notes ?? ""
      }
    });

    return NextResponse.json({
      url: session.url
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Checkout session failed"
      },
      {
        status: 500
      }
    );
  }
}