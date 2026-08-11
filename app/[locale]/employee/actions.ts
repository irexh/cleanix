"use server";

import {revalidatePath} from "next/cache";

import {auth} from "@/auth";
import {sendAdminEmail} from "@/lib/admin-email";
import {prisma} from "@/lib/prisma";

const bookingAdminEmail =
  process.env.BOOKING_REQUEST_TO_EMAIL ||
  process.env.BUSINESS_INQUIRY_TO_EMAIL ||
  "info@cleanix.si";

type EmployeeBookingStatus = "CONFIRMED" | "IN_PROGRESS" | "COMPLETED";

function formatBooking(selectedDate: string, selectedTime: string) {
  return `${selectedDate} ob ${selectedTime}`;
}

function hoursUntilBooking(selectedDate: string, selectedTime: string) {
  const bookingDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

  return (bookingDateTime.getTime() - Date.now()) / 36e5;
}

async function getEmployeeOrThrow() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Niste prijavljeni.");
  }

  const employee = await prisma.employee.findFirst({
    where: {
      email: session.user.email,
      isActive: true
    },
    select: {id: true, name: true, email: true}
  });

  if (!employee) {
    throw new Error("Zaposleni profil ni povezan s tem računom.");
  }

  return employee;
}

export async function claimBookingAction(formData: FormData) {
  const employee = await getEmployeeOrThrow();
  const bookingId = String(formData.get("bookingId") ?? "").trim();

  if (!bookingId) {
    throw new Error("Manjka identifikator naloga.");
  }

  const booking = await prisma.booking.findUnique({
    where: {id: bookingId},
    select: {
      id: true,
      employeeId: true,
      email: true,
      fullName: true,
      selectedDate: true,
      selectedTime: true,
      city: true,
      address: true,
      propertyType: true
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
      employeeId: employee.id,
      bookingStatus: "CONFIRMED"
    }
  });

  if (booking.email) {
    await sendAdminEmail({
      to: booking.email,
      subject: "Cleanix - nalog je prevzet",
      text: [
        `Pozdravljeni ${booking.fullName},`,
        "",
        `vaš termin ${formatBooking(booking.selectedDate, booking.selectedTime)} je prevzela čistilka ${employee.name}.`,
        `${booking.city}, ${booking.address}`,
        `Storitev: ${booking.propertyType}`,
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

export async function updateEmployeeBookingStatusAction(formData: FormData) {
  const employee = await getEmployeeOrThrow();
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const nextStatus = String(formData.get("status") ?? "").trim() as EmployeeBookingStatus;

  if (!bookingId) {
    throw new Error("Manjka identifikator naloga.");
  }

  if (!["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(nextStatus)) {
    throw new Error("Neveljaven status.");
  }

  const booking = await prisma.booking.findUnique({
    where: {id: bookingId},
    select: {
      id: true,
      employeeId: true,
      email: true,
      fullName: true,
      selectedDate: true,
      selectedTime: true,
      city: true,
      address: true,
      propertyType: true,
      bookingStatus: true,
      notes: true
    }
  });

  if (!booking) {
    throw new Error("Nalog ne obstaja.");
  }

  if (booking.employeeId !== employee.id) {
    throw new Error("Ta nalog ni dodeljen vam.");
  }

  await prisma.booking.update({
    where: {id: bookingId},
    data: {
      bookingStatus: nextStatus,
      notes: booking.notes
        ? `${booking.notes}\n\n[${new Date().toISOString()}] Status: ${nextStatus}`
        : `[${new Date().toISOString()}] Status: ${nextStatus}`
    }
  });

  const label = formatBooking(booking.selectedDate, booking.selectedTime);
  const statusText =
    nextStatus === "CONFIRMED"
      ? "je nalog prevzela čistilka"
      : nextStatus === "IN_PROGRESS"
        ? "je čistilka na poti"
        : "je delo zaključeno";

  if (booking.email) {
    await sendAdminEmail({
      to: booking.email,
      subject:
        nextStatus === "COMPLETED"
          ? "Cleanix - nalog je opravljen"
          : nextStatus === "IN_PROGRESS"
            ? "Cleanix - čistilka je na poti"
            : "Cleanix - nalog je prevzet",
      text: [
        `Pozdravljeni ${booking.fullName},`,
        "",
        `obveščamo vas, da ${statusText}.`,
        "",
        `Termin: ${label}`,
        `Naslov: ${booking.city}, ${booking.address}`,
        `Storitev: ${booking.propertyType}`,
        "",
        "Lep pozdrav,",
        "Cleanix"
      ].join("\n")
    }).catch((error) => {
      console.error("Employee status email failed", error);
    });
  }

  if (bookingAdminEmail) {
    await sendAdminEmail({
      to: bookingAdminEmail,
      subject: `Cleanix - status naloga ${nextStatus}`,
      replyTo: booking.email || undefined,
      text: [
        `Čistilka: ${employee.name}`,
        `Stranka: ${booking.fullName}`,
        `Status: ${nextStatus}`,
        `Termin: ${label}`,
        `Lokacija: ${booking.city}, ${booking.address}`,
        `Storitev: ${booking.propertyType}`
      ].join("\n")
    }).catch((error) => {
      console.error("Employee status admin email failed", error);
    });
  }

  revalidatePath("/sl/employee");
  revalidatePath("/sl/profile");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}

export async function cancelClaimedBookingAction(formData: FormData) {
  const employee = await getEmployeeOrThrow();
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const reason = String(formData.get("cancelReason") ?? "").trim();

  if (!bookingId) {
    throw new Error("Manjka identifikator naloga.");
  }

  if (reason.length < 10) {
    throw new Error("Vpišite jasen razlog preklica.");
  }

  const booking = await prisma.booking.findUnique({
    where: {id: bookingId},
    select: {
      id: true,
      employeeId: true,
      email: true,
      fullName: true,
      selectedDate: true,
      selectedTime: true,
      city: true,
      address: true,
      propertyType: true,
      notes: true
    }
  });

  if (!booking) {
    throw new Error("Nalog ne obstaja.");
  }

  if (booking.employeeId !== employee.id) {
    throw new Error("Ta nalog ni dodeljen vam.");
  }

  const shortNotice = hoursUntilBooking(booking.selectedDate, booking.selectedTime) < 24;
  const cancelNote = [
    `[${new Date().toISOString()}] Preklic čistilke: ${employee.name}`,
    shortNotice
      ? "Opozorilo: manj kot 24 ur do termina."
      : "Preklic več kot 24 ur pred terminom.",
    `Razlog: ${reason}`
  ].join(" ");

  await prisma.booking.update({
    where: {id: bookingId},
    data: {
      employeeId: null,
      bookingStatus: "CANCELLED",
      notes: booking.notes ? `${booking.notes}\n${cancelNote}` : cancelNote
    }
  });

  await sendAdminEmail({
    to: bookingAdminEmail,
    subject: "Cleanix - čistilka je preklicala nalog",
    text: [
      `Čistilka: ${employee.name} (${employee.email ?? "brez e-pošte"})`,
      `Stranka: ${booking.fullName} (${booking.email ?? "brez e-pošte"})`,
      `Termin: ${formatBooking(booking.selectedDate, booking.selectedTime)}`,
      `Lokacija: ${booking.city}, ${booking.address}`,
      shortNotice ? "OPOZORILO: preklic manj kot 24 ur pred terminom." : "",
      "",
      `Razlog: ${reason}`
    ].join("\n")
  }).catch((error) => {
    console.error("Employee cancel admin email failed", error);
  });

  if (booking.email) {
    await sendAdminEmail({
      to: booking.email,
      subject: "Cleanix - termin je preklican",
      text: [
        `Pozdravljeni ${booking.fullName},`,
        "",
        "vaš termin je čistilka preklicala.",
        `Termin: ${formatBooking(booking.selectedDate, booking.selectedTime)}`,
        `Razlog: ${reason}`,
        "",
        "Lep pozdrav,",
        "Cleanix"
      ].join("\n")
    }).catch((error) => {
      console.error("Employee cancel customer email failed", error);
    });
  }

  revalidatePath("/sl/employee");
  revalidatePath("/sl/profile");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/calendar");
}
