import axios from 'axios';

export default async ({ to, subject, htmlBody, textBody, from = process.env.POSTMARK_FROM_EMAIL }) => {

  const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;

  if (!POSTMARK_API_KEY) {
    throw new Error('POSTMARK_API_KEY environment variable is not set');
  }

  if (!from) {
    throw new Error('POSTMARK_FROM_EMAIL environment variable is not set');
  }

  try {
    const response = await axios.post(
      'https://api.postmarkapp.com/email',
      {
        From: from,
        To: to,
        Subject: subject,
        HtmlBody: htmlBody,
        TextBody: textBody || htmlBody.replace(/<[^>]*>/g, ''),
        MessageStream: 'outbound'
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': POSTMARK_API_KEY
        }
      }
    );

    return {
      success: true,
      messageId: response.data.MessageID,
      to: response.data.To
    };

  } catch (error) {
    console.error('Postmark email error:', error.response?.data || error.message);
    throw {
      message: 'Failed to send email',
      statusCode: 500,
      details: error.response?.data || error.message
    };
  }

};