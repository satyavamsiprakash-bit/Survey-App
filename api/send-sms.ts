import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, body } = request.body;

  if (!to || !body) {
    return response.status(400).json({ error: 'Missing required fields: to and body.' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error('Twilio environment variables are not set.');
    return response.status(500).json({ error: 'Internal Server Error: SMS service not configured.' });
  }
  
  // Twilio requires phone numbers in E.164 format.
  // This simple logic prepends +1 for US numbers.
  // A more robust solution would validate and format numbers from different regions.
  const formattedTo = `+1${to.replace(/\D/g, '')}`;

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to: formattedTo,
    });

    console.log('SMS sent successfully:', message.sid);
    response.status(200).json({ success: true, sid: message.sid });

  } catch (error) {
    console.error("Error sending SMS via Twilio:", error);
    response.status(500).json({ error: 'Failed to send confirmation SMS.' });
  }
}
