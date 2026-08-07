import nodemailer from "nodemailer";

type BookingRequestEmailData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  propertyType: string;
  propertySize: string;
  bathrooms: number;
  extras: string[];
  frequency: string;
  duration?: string;
  selectedDate: string;
  selectedTime: string;
  notes?: string;
};

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM || "Cleanix <info@cleanix.si>";
const bookingRequestToEmail =
  process.env.BOOKING_REQUEST_TO_EMAIL || process.env.BUSINESS_INQUIRY_TO_EMAIL || "info@cleanix.si";

function bookingRequestText(data: BookingRequestEmailData) {
  return `Novo rezervacijsko povpraševanje

Ime in priimek: ${data.fullName}
E-pošta: ${data.email}
Telefon: ${data.phone}
Naslov čiščenja: ${data.address}
Mesto: ${data.city}
Prostor: ${data.propertyType}
Velikost: ${data.propertySize}
Kopalnice: ${data.bathrooms}
Dodatne storitve: ${data.extras.length > 0 ? data.extras.join(", ") : "Ni dodatnih storitev"}
Pogostost: ${data.frequency}
${data.duration ? `Trajanje: ${data.duration}\n` : ""}Datum: ${data.selectedDate}
Ura: ${data.selectedTime}

Opombe:
${data.notes?.trim() || "Ni dodatnih opomb."}

Povpraševanje je shranjeno v admin inboxu.
`.trim();
}

export async function sendBookingRequestEmail(data: BookingRequestEmailData) {
  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.warn("SMTP settings are missing. Booking request email was skipped.");
    return {sent: false, reason: "missing_smtp_settings"};
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword
    }
  });

  const info = await transporter.sendMail({
    from: smtpFrom,
    to: bookingRequestToEmail,
    replyTo: data.email,
    subject: `Novo povpraševanje za čiščenje: ${data.propertyType} (${data.city})`,
    text: bookingRequestText(data)
  });

  return {sent: true, id: info.messageId};
}
