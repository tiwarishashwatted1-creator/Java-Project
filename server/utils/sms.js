let twilioClient = null;

export function getTwilio() {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) return null;
  if (!twilioClient) {
    const twilio = require("twilio");
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  }
  return twilioClient;
}

export async function sendSMS(to, body) {
  const client = getTwilio();
  if (!client) return;
  await client.messages.create({ to, from: process.env.TWILIO_FROM, body });
}
