import {Resend} from "resend";

type BusinessInquiryEmailData = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Cleanix <info@cleanix.si>";
const businessInquiryToEmail =
  process.env.BUSINESS_INQUIRY_TO_EMAIL || "info@cleanix.si";

function businessInquiryText(inquiry: BusinessInquiryEmailData) {
  return `
Novo Cleanix Business povpraševanje

Ime in priimek: ${inquiry.fullName}
E-pošta: ${inquiry.email}
Telefon: ${inquiry.phone}

Sporočilo:
${inquiry.message}

Povpraševanje je shranjeno tudi v admin inboxu.
`.trim();
}

export async function sendBusinessInquiryEmail(
  inquiry: BusinessInquiryEmailData
) {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is missing. Business inquiry email was skipped.");
    return {sent: false, reason: "missing_api_key"};
  }

  const resend = new Resend(resendApiKey);

  const {data, error} = await resend.emails.send({
    from: fromEmail,
    to: businessInquiryToEmail,
    replyTo: inquiry.email,
    subject: `Novo Business povpraševanje: ${inquiry.fullName}`,
    text: businessInquiryText(inquiry)
  });

  if (error) {
    throw error;
  }

  return {sent: true, id: data?.id};
}
