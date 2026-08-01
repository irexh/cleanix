import {NextRequest, NextResponse} from "next/server";
import Stripe from "stripe";

import {prisma} from "@/lib/prisma";
import {stripe} from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {error: "Manjka Stripe podpis."},
      {status: 400}
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      {error: "Neveljaven Stripe podpis."},
      {status: 400}
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    await prisma.booking.upsert({
      where: {
        stripeSessionId: session.id
      },
      update: {
        paymentStatus: "PAID",
        notes: session.metadata?.notes ?? ""
      },
      create: {
        fullName: session.metadata?.fullName ?? "",
        email: session.metadata?.email ?? "",
        phone: session.metadata?.phone ?? "",
        address: session.metadata?.address ?? "",
        city: session.metadata?.city ?? "",
        propertyType: session.metadata?.propertyType ?? "",
        propertySize: session.metadata?.propertySize ?? "",
        bathrooms: Number(session.metadata?.bathrooms ?? 1),
        extras: session.metadata?.extras ?? "[]",
        selectedDate: session.metadata?.selectedDate ?? "",
        selectedTime: session.metadata?.selectedTime ?? "",
        totalPrice: Math.round((session.amount_total ?? 0) / 100),
        notes: session.metadata?.notes ?? "",
        paymentStatus: "PAID",
        bookingStatus: "PENDING",
        stripeSessionId: session.id
      }
    });
  }

  return NextResponse.json({received: true});
}