import {NextRequest, NextResponse} from "next/server";

import {auth} from "@/auth";
import {sendAdminEmail} from "@/lib/admin-email";
import {prisma} from "@/lib/prisma";

type SendMessageBody = {
  to?: string;
  replyTo?: string;
  subject?: string;
  text?: string;
};

export async function POST(request: NextRequest) {
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

  const body = (await request.json()) as SendMessageBody;
  const to = body.to?.trim();
  const subject = body.subject?.trim();
  const text = body.text?.trim();
  const replyTo = body.replyTo?.trim();

  if (!to || !subject || !text) {
    return NextResponse.json(
      {error: "Manjkajo podatki za pošiljanje."},
      {status: 400}
    );
  }

  const result = await sendAdminEmail({
    to,
    subject,
    text,
    replyTo: replyTo || undefined
  });

  return NextResponse.json({success: true, result});
}
