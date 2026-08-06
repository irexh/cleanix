import nodemailer from "nodemailer";

type BusinessInquiryEmailData = {
  fullName: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
};

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM || "Cleanix <info@cleanix.si>";
const businessInquiryToEmail =
  process.env.BUSINESS_INQUIRY_TO_EMAIL || "info@cleanix.si";

function businessInquiryText(inquiry: BusinessInquiryEmailData) {
  return `
Novo Cleanix povpraševanje

Ime in priimek: ${inquiry.fullName}
E-pošta: ${inquiry.email}
Telefon: ${inquiry.phone}
Storitev: ${inquiry.service || "Ni izbrano"}

Sporočilo:
${inquiry.message}

Povpraševanje je shranjeno tudi v admin inboxu.
`.trim();
}

export async function sendBusinessInquiryEmail(
  inquiry: BusinessInquiryEmailData
) {
  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.warn("SMTP settings are missing. Business inquiry email was skipped.");
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
    to: businessInquiryToEmail,
    replyTo: inquiry.email,
    subject: `Novo povpraševanje: ${inquiry.service || inquiry.fullName}`,
    text: businessInquiryText(inquiry)
  });

  return {sent: true, id: info.messageId};
}
