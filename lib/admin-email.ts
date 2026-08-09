import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM || "Cleanix <info@cleanix.si>";

export type AdminEmailPayload = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendAdminEmail({
  to,
  subject,
  text,
  replyTo
}: AdminEmailPayload) {
  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.warn("SMTP settings are missing. Admin email was skipped.");
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
    to,
    replyTo,
    subject,
    text
  });

  return {sent: true, id: info.messageId};
}
