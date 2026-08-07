import {NextRequest, NextResponse} from "next/server";

import {auth} from "@/auth";
import {businessInquiryPrisma} from "@/lib/business-inquiry-prisma";
import {prisma} from "@/lib/prisma";

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

  const existingInquiry = await businessInquiryPrisma.businessInquiry.findUnique({
    where: {id}
  });

  if (!existingInquiry) {
    return NextResponse.json({error: "Poslovno povpraševanje ne obstaja."}, {status: 404});
  }

  await businessInquiryPrisma.businessInquiry.delete({where: {id}});

  return NextResponse.json({success: true});
}
