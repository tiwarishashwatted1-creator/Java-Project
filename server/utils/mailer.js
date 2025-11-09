import nodemailer from "nodemailer";

let transporter;
export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html }) {
  if (!process.env.SMTP_HOST) return;
  const from = process.env.MAIL_FROM || "no-reply@example.com";
  await getTransporter().sendMail({ from, to, subject, html });
}
