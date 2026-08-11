"use server";

import {revalidatePath} from "next/cache";

import {auth} from "@/auth";
import {sendAdminEmail} from "@/lib/admin-email";
import {prisma} from "@/lib/prisma";

export async function claimBookingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Niste prijavljeni.");
  }

  const bookingId = String(formData.get("bookingId") ?? "");

  if (!bookingId) {
    throw new Error("Manjka booking id.");
  }

  const employee = await prisma.employee.findFirst({
    where: {
      email: session.user.email,
      isActive: true
    },
    select: {id: true, name: true}
  });

  if (!employee) {
    throw new Error("Zaposleni profil ni povezan s tem računom.");
  }

  const booking = await prisma.booking.findUnique({
    where: {id: bookingId},
    select: {
      employeeId: true,
      email: true,
      fullName: true,
      selectedDate: true,
      selectedTime: true,
      city: true,
      address: true
    }
  });

  if (!booking) {
    throw new Error("Nalog ne obstaja.");
  }

  if (booking.employeeId && booking.employeeId !== employee.id) {
    throw new Error("Ta nalog je že prevzel drug zaposleni.");
  }

  await prisma.booking.update({
    where: {id: bookingId},
    data: {
      employeeId: employee.id
    }
  });

  if (booking.email) {
    await sendAdminEmail({
      to: booking.email,
      subject: "Cleanix - termin je potrjen",
      text: [
        `Pozdravljeni ${booking.fullName},`,
        "",
        `vas termin ${booking.selectedDate} ob ${booking.selectedTime} je prevzela cistilka ${employee.name}.`,
        `${booking.city}, ${booking.address}`,
        "",
        "Hvala za zaupanje.",
        "Cleanix"
      ].join("\n")
    }).catch((error) => {
      console.error("Employee claim email failed", error);
    });
  }

  revalidatePath("/sl/employee");
  revalidatePath("/sl/profile");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}

export async function cancelClaimedBookingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Niste prijavljeni.");
  }

  const bookingId = String(formData.get("bookingId") ?? "");
  const reason = String(formData.get("cancelReason") ?? "").trim();

  if (!bookingId) {
    throw new Error("Manjka booking id.");
  }

  if (reason.length < 10) {
    throw new Error("Vpisite jasen razlog preklica.");
  }

  const employee = await prisma.employee.findFirst({
    where: {
      email: session.user.email,
      isActive: true
    },
    select: {id: true, name: true, email: true}
  });

  if (!employee) {
    throw new Error("Zaposleni profil ni povezan s tem racunom.");
  }

  const booking = await prisma.booking.findUnique({
    where: {id: bookingId},
    select: {
      employeeId: true,
      email: true,
      fullName: true,
      selectedDate: true,
      selectedTime: true,
      city: true,
      address: true,
      notes: true
    }
  });

  if (!booking) {
    throw new Error("Nalog ne obstaja.");
  }

  if (booking.employeeId !== employee.id) {
    throw new Error("Ta nalog ni dodeljen vam.");
  }

  const bookingDateTime = new Date(`${booking.selectedDate}T${booking.selectedTime}:00`);
  const hoursUntil = (bookingDateTime.getTime() - Date.now()) / 36e5;
  const shortNotice = hoursUntil <= 24;
  const cancelNote = [
    `[${new Date().toISOString()}] Preklic cistilke: ${employee.name}`,
    shortNotice ? "Opozorilo: manj kot 24 ur do termina." : "Preklic vec kot 24 ur pred terminom.",
    `Razlog: ${reason}`
  ].join(" ");

  await prisma.booking.update({
    where: {id: bookingId},
    data: {
      employeeId: null,
      notes: booking.notes ? `${booking.notes}\n${cancelNote}` : cancelNote
    }
  });

  const adminEmail =
    process.env.BUSINESS_INQUIRY_TO_EMAIL ||
    process.env.SMTP_USER ||
    "info@cleanix.si";

  await sendAdminEmail({
    to: adminEmail,
    subject: "Cleanix - cistilka je preklicala nalog",
    text: [
      `Cistilka: ${employee.name} (${employee.email ?? "brez e-poste"})`,
      `Stranka: ${booking.fullName} (${booking.email})`,
      `Termin: ${booking.selectedDate} ob ${booking.selectedTime}`,
      `Lokacija: ${booking.city}, ${booking.address}`,
      shortNotice ? "OPOZORILO: preklic manj kot 24 ur pred terminom." : "",
      "",
      `Razlog: ${reason}`
    ].join("\n")
  }).catch((error) => {
    console.error("Employee cancel admin email failed", error);
  });

  revalidatePath("/sl/employee");
  revalidatePath("/sl/profile");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}
