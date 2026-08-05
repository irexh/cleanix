import {Resend} from "resend";

type BookingEmailStatus = "CONFIRMED" | "CANCELLED";

type BookingEmailData = {
  fullName: string;
  email: string;
  selectedDate: string;
  selectedTime: string;
  address: string;
  city: string;
  totalPrice: number;
};

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Cleanix <info@cleanix.si>";

function statusSubject(status: BookingEmailStatus) {
  if (status === "CONFIRMED") {
    return "Vaš termin je potrjen";
  }

  return "Vaš termin je preklican";
}

function statusText(status: BookingEmailStatus, booking: BookingEmailData) {
  if (status === "CONFIRMED") {
    return `
Pozdravljeni ${booking.fullName},

vaš termin čiščenja je potrjen.

Termin: ${booking.selectedDate} ob ${booking.selectedTime}
Naslov: ${booking.address}, ${booking.city}
Znesek: EUR ${booking.totalPrice}

Če potrebujete spremembo termina, nam prosim pišite vsaj 24 ur prej.

Lep pozdrav,
Cleanix
`.trim();
  }

  return `
Pozdravljeni ${booking.fullName},

obveščamo vas, da je vaš termin čiščenja preklican.

Termin: ${booking.selectedDate} ob ${booking.selectedTime}
Naslov: ${booking.address}, ${booking.city}

Za nov termin nas lahko kontaktirate ali ponovno oddate rezervacijo na spletni strani.

Lep pozdrav,
Cleanix
`.trim();
}

export async function sendBookingStatusEmail(
  status: BookingEmailStatus,
  booking: BookingEmailData
) {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is missing. Booking status email was skipped.");
    return {sent: false, reason: "missing_api_key"};
  }

  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: fromEmail,
    to: booking.email,
    subject: statusSubject(status),
    text: statusText(status, booking)
  });

  return {sent: true};
}
