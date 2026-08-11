"use server";

import {revalidatePath} from "next/cache";

import {auth} from "@/auth";
import {sendAdminEmail} from "@/lib/admin-email";
import {prisma} from "@/lib/prisma";

export type ProfileSettingsState = {
  success: boolean;
  message: string;
};

const initialState: ProfileSettingsState = {
  success: false,
  message: ""
};

const bookingAdminEmail =
  process.env.BOOKING_REQUEST_TO_EMAIL ||
  process.env.BUSINESS_INQUIRY_TO_EMAIL ||
  "info@cleanix.si";

const editWindowHours = 24;

function bookingDateTime(selectedDate: string, selectedTime: string) {
  return new Date(`${selectedDate}T${selectedTime}:00`);
}

function hoursUntilBooking(selectedDate: string, selectedTime: string) {
  const diffMs = bookingDateTime(selectedDate, selectedTime).getTime() - Date.now();

  return diffMs / (1000 * 60 * 60);
}

function isChangeAllowed(selectedDate: string, selectedTime: string) {
  return hoursUntilBooking(selectedDate, selectedTime) >= editWindowHours;
}

function bookingDisplayLabel(selectedDate: string, selectedTime: string) {
  return `${selectedDate} ob ${selectedTime}`;
}

export async function updateProfileSettings(
  _prevState: ProfileSettingsState = initialState,
  formData: FormData
): Promise<ProfileSettingsState> {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      success: false,
      message: "Seja je potekla. Prijavite se znova."
    };
  }

  const currentEmail = session.user.email;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email) {
    return {
      success: false,
      message: "Ime in e-pošta sta obvezna."
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {email}
  });

  if (existingUser && existingUser.email !== currentEmail) {
    return {
      success: false,
      message: "Ta e-poštni naslov je že v uporabi."
    };
  }

  await prisma.user.update({
    where: {email: currentEmail},
    data: {
      name,
      email
    }
  });

  await prisma.booking.updateMany({
    where: {email: currentEmail},
    data: {
      email,
      fullName: name,
      ...(phone ? {phone} : {})
    }
  });

  revalidatePath("/sl/profile");
  revalidatePath("/sl");
  revalidatePath("/sl/booking");

  return {
    success: true,
    message:
      email !== currentEmail
        ? "Podatki so shranjeni. Po spremembi e-pošte se za vsak primer prijavite znova."
        : "Podatki so uspešno shranjeni."
  };
}

type BookingActionState = {
  success: boolean;
  message: string;
};

const bookingActionInitialState: BookingActionState = {
  success: false,
  message: ""
};

export async function cancelCustomerBookingAction(
  _prevState: BookingActionState = bookingActionInitialState,
  formData: FormData
): Promise<BookingActionState> {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      success: false,
      message: "Seja je potekla. Prijavite se znova."
    };
  }

  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!bookingId) {
    return {
      success: false,
      message: "Manjka identifikator termina."
    };
  }

  if (!reason) {
    return {
      success: false,
      message: "Vpišite jasen razlog preklica."
    };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      email: session.user.email
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      selectedDate: true,
      selectedTime: true,
      address: true,
      city: true,
      propertyType: true,
      bookingStatus: true,
      notes: true
    }
  });

  if (!booking) {
    return {
      success: false,
      message: "Termina ni mogoče najti."
    };
  }

  if (!isChangeAllowed(booking.selectedDate, booking.selectedTime)) {
    return {
      success: false,
      message: "Preklic ni več mogoč, ker je do termina manj kot 24 ur."
    };
  }

  if (booking.bookingStatus === "CANCELLED") {
    return {
      success: false,
      message: "Termin je že preklican."
    };
  }

  const cancelNote = [
    `Preklic stranke`,
    `Razlog: ${reason}`,
    `Čas preklica: ${new Date().toLocaleString("sl-SI")}`
  ].join("\n");

  await prisma.booking.update({
    where: {id: booking.id},
    data: {
      bookingStatus: "CANCELLED",
      employeeId: null,
      notes: booking.notes ? `${booking.notes}\n\n${cancelNote}` : cancelNote
    }
  });

  const displayLabel = bookingDisplayLabel(booking.selectedDate, booking.selectedTime);

  try {
    await sendAdminEmail({
      to: booking.email,
      subject: `Cleanix - preklic potrjen`,
      text: `
Pozdravljeni ${booking.fullName},

prejeli smo vaš preklic termina.

Termin: ${displayLabel}
Naslov: ${booking.address}, ${booking.city}
Storitev: ${booking.propertyType}

Lep pozdrav,
Cleanix
`.trim()
    });
  } catch (error) {
    console.error("Customer cancel confirmation email failed", error);
  }

  try {
    await sendAdminEmail({
      to: bookingAdminEmail,
      subject: `Cleanix - preklican termin ${displayLabel}`,
      replyTo: booking.email,
      text: `
Preklic termina s strani stranke

Stranka: ${booking.fullName}
E-pošta: ${booking.email}
Termin: ${displayLabel}
Naslov: ${booking.address}, ${booking.city}
Storitev: ${booking.propertyType}

Razlog:
${reason}
`.trim()
    });
  } catch (error) {
    console.error("Admin cancel notification failed", error);
  }

  revalidatePath("/sl/profile");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/inbox");
  revalidatePath("/sl/admin/calendar");
  revalidatePath("/sl/employee");

  return {
    success: true,
    message: "Termin je preklican. O tem smo obvestili tudi ekipo."
  };
}

export async function rescheduleCustomerBookingAction(
  _prevState: BookingActionState = bookingActionInitialState,
  formData: FormData
): Promise<BookingActionState> {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      success: false,
      message: "Seja je potekla. Prijavite se znova."
    };
  }

  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const newDate = String(formData.get("newDate") ?? "").trim();
  const newTime = String(formData.get("newTime") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!bookingId || !newDate || !newTime || !reason) {
    return {
      success: false,
      message: "Izpolnite vse podatke za spremembo termina."
    };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      email: session.user.email
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      selectedDate: true,
      selectedTime: true,
      address: true,
      city: true,
      propertyType: true,
      propertySize: true,
      bookingStatus: true,
      notes: true
    }
  });

  if (!booking) {
    return {
      success: false,
      message: "Termina ni mogoče najti."
    };
  }

  if (!isChangeAllowed(booking.selectedDate, booking.selectedTime)) {
    return {
      success: false,
      message: "Sprememba ni več možna, ker je do termina manj kot 24 ur."
    };
  }

  if (booking.bookingStatus === "CANCELLED" || booking.bookingStatus === "COMPLETED") {
    return {
      success: false,
      message: "Za ta termin sprememba ni več možna."
    };
  }

  if (!isChangeAllowed(newDate, newTime)) {
    return {
      success: false,
      message: "Novi termin mora biti vsaj 24 ur vnaprej."
    };
  }

  const updateNote = [
    `Zahteva za spremembo termina`,
    `Prejšnji termin: ${bookingDisplayLabel(booking.selectedDate, booking.selectedTime)}`,
    `Novi termin: ${bookingDisplayLabel(newDate, newTime)}`,
    `Razlog: ${reason}`,
    `Čas zahteve: ${new Date().toLocaleString("sl-SI")}`
  ].join("\n");

  await prisma.booking.update({
    where: {id: booking.id},
    data: {
      selectedDate: newDate,
      selectedTime: newTime,
      bookingStatus: "PENDING",
      employeeId: null,
      notes: booking.notes ? `${booking.notes}\n\n${updateNote}` : updateNote
    }
  });

  const oldDisplayLabel = bookingDisplayLabel(
    booking.selectedDate,
    booking.selectedTime
  );
  const newDisplayLabel = bookingDisplayLabel(newDate, newTime);

  try {
    await sendAdminEmail({
      to: booking.email,
      subject: "Cleanix - sprememba termina sprejeta",
      text: `
Pozdravljeni ${booking.fullName},

vaša sprememba termina je bila uspešno zabeležena.

Prejšnji termin: ${oldDisplayLabel}
Novi termin: ${newDisplayLabel}
Naslov: ${booking.address}, ${booking.city}

Če potrebujete dodatno pomoč, smo vam na voljo.

Lep pozdrav,
Cleanix
`.trim()
    });
  } catch (error) {
    console.error("Customer reschedule confirmation email failed", error);
  }

  try {
    await sendAdminEmail({
      to: bookingAdminEmail,
      subject: `Cleanix - sprememba termina ${newDisplayLabel}`,
      replyTo: booking.email,
      text: `
Sprememba termina s strani stranke

Stranka: ${booking.fullName}
E-pošta: ${booking.email}
Prejšnji termin: ${oldDisplayLabel}
Novi termin: ${newDisplayLabel}
Naslov: ${booking.address}, ${booking.city}
Storitev: ${booking.propertyType}
Velikost: ${booking.propertySize}

Razlog:
${reason}
`.trim()
    });
  } catch (error) {
    console.error("Admin reschedule notification failed", error);
  }

  revalidatePath("/sl/profile");
  revalidatePath("/sl/admin");
  revalidatePath("/sl/admin/inbox");
  revalidatePath("/sl/admin/calendar");
  revalidatePath("/sl/employee");

  return {
    success: true,
    message: "Novi termin je shranjen. Ekipa je obveščena."
  };
}
