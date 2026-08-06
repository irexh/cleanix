import {NextResponse} from "next/server";

import {sendBusinessInquiryEmail} from "@/lib/business-inquiry-email";
import {businessInquiryPrisma} from "@/lib/business-inquiry-prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const service = String(body.service ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        {error: "Prosimo, izpolnite vsa polja."},
        {status: 400}
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {error: "Vnesite veljaven e-poštni naslov."},
        {status: 400}
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        {error: "Sporočilo je lahko dolgo največ 500 znakov."},
        {status: 400}
      );
    }

    await businessInquiryPrisma.businessInquiry.create({
      data: {
        fullName,
        email,
        phone,
        service: service || null,
        message
      }
    });

    try {
      await sendBusinessInquiryEmail({
        fullName,
        email,
        phone,
        service,
        message
      });
    } catch (error) {
      console.error("Business inquiry email error:", error);

      return NextResponse.json(
        {
          error:
            "Povpraševanje je shranjeno, vendar e-pošte trenutno ni mogoče poslati."
        },
        {status: 502}
      );
    }

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Business inquiry error:", error);

    return NextResponse.json(
      {error: "Povpraševanja trenutno ni mogoče poslati."},
      {status: 500}
    );
  }
}
