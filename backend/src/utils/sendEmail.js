const { Resend } = require('resend');

const DEFAULT_ADMIN_CONTACT_EMAIL = 'hostelblooom@gmail.com';

let resendClient;

function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

function getEmailConfigError() {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return 'Email service is not configured. Set RESEND_API_KEY and EMAIL_FROM in the backend environment.';
  }
  return null;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return escapeHtml(value || 'N/A');
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatCurrency(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return 'N/A';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}



function buildBookingEmailHtml(bookingData) {
  const details = [
    ['User Name', bookingData.name],
    ['Room Number', bookingData.room],
    ['Check-in Date', formatDate(bookingData.checkIn)],
    ['Check-out Date', formatDate(bookingData.checkOut)],
    ['Total Price', formatCurrency(bookingData.price)],
    ['Booking ID', bookingData.id],
  ];

  const detailRows = details
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 12px 0; color: #5b5f6b; font-size: 14px; border-bottom: 1px solid #ece7df;">${escapeHtml(label)}</td>
          <td style="padding: 12px 0; color: #17202a; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #ece7df;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <div style="margin: 0; padding: 32px 16px; background: #f7f1e8; font-family: Arial, sans-serif; color: #17202a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(23, 32, 42, 0.12);">
        <div style="padding: 36px 40px; background: linear-gradient(135deg, #0f766e, #164e63); color: #ffffff;">
          <p style="margin: 0 0 10px; letter-spacing: 0.12em; text-transform: uppercase; font-size: 12px; opacity: 0.85;">HostelBloom</p>
          <h2 style="margin: 0; font-size: 30px; line-height: 1.2;">Booking Confirmed</h2>
          <p style="margin: 12px 0 0; font-size: 15px; line-height: 1.7; color: rgba(255, 255, 255, 0.92);">
            Your stay has been reserved successfully. We are excited to host you.
          </p>
        </div>
        <div style="padding: 32px 40px;">
          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.7;">
            Hi ${escapeHtml(bookingData.name || 'Guest')},
          </p>
          <p style="margin: 0 0 26px; font-size: 15px; line-height: 1.7; color: #3c4654;">
            Thank you for choosing HostelBloom. Here are the details of your confirmed booking.
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${detailRows}
            </tbody>
          </table>
          <div style="margin-top: 28px; padding: 18px 20px; border-radius: 14px; background: #f8fafc; color: #475569; font-size: 14px; line-height: 1.7;">
            Please keep this email for your records. If you need any changes, reply to this message and our team will help you.
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildBookingEmailText(bookingData) {
  return [
    'Booking Confirmed - HostelBloom',
    '',
    `User Name: ${bookingData.name || 'Guest'}`,
    `Room Number: ${bookingData.room || 'N/A'}`,
    `Check-in Date: ${formatDate(bookingData.checkIn)}`,
    `Check-out Date: ${formatDate(bookingData.checkOut)}`,
    `Total Price: ${formatCurrency(bookingData.price)}`,
    `Booking ID: ${bookingData.id || 'N/A'}`,
  ].join('\n');
}

function buildContactEmailHtml(data) {
  const subjectBlock = data.subject
    ? `
      <tr>
        <td style="padding: 12px 0; color: #5b5f6b; font-size: 14px; border-bottom: 1px solid #ece7df;">Subject</td>
        <td style="padding: 12px 0; color: #17202a; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #ece7df;">${escapeHtml(data.subject)}</td>
      </tr>
    `
    : '';

  return `
    <div style="margin: 0; padding: 32px 16px; background: #f8fafc; font-family: Arial, sans-serif; color: #17202a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(23, 32, 42, 0.12);">
        <div style="padding: 32px 40px; background: linear-gradient(135deg, #b45309, #92400e); color: #ffffff;">
          <p style="margin: 0 0 10px; letter-spacing: 0.12em; text-transform: uppercase; font-size: 12px; opacity: 0.85;">HostelBloom Contact</p>
          <h3 style="margin: 0; font-size: 28px; line-height: 1.2;">New Contact Message</h3>
          <p style="margin: 12px 0 0; font-size: 15px; line-height: 1.7; color: rgba(255, 255, 255, 0.92);">
            A new enquiry has arrived from the website contact form.
          </p>
        </div>
        <div style="padding: 32px 40px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; color: #5b5f6b; font-size: 14px; border-bottom: 1px solid #ece7df;">Name</td>
                <td style="padding: 12px 0; color: #17202a; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #ece7df;">${escapeHtml(data.name)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #5b5f6b; font-size: 14px; border-bottom: 1px solid #ece7df;">Email</td>
                <td style="padding: 12px 0; color: #17202a; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #ece7df;">${escapeHtml(data.email)}</td>
              </tr>
              ${subjectBlock}
            </tbody>
          </table>
          <div style="margin-top: 24px; padding: 20px; border-radius: 14px; background: #f8fafc;">
            <p style="margin: 0 0 10px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b;">Message</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.8; white-space: pre-wrap; color: #334155;">${escapeHtml(data.message)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildContactEmailText(data) {
  return [
    'New Contact Message - HostelBloom',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.subject ? `Subject: ${data.subject}` : null,
    `Message: ${data.message}`,
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendMail(mailOptions, label) {
  const configError = getEmailConfigError();
  if (configError) {
    console.error(`[email:${label}] ${configError}`);
    return { success: false, message: configError };
  }

  try {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
      from: mailOptions.from,
      to: mailOptions.to,
      reply_to: mailOptions.replyTo || undefined,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
    });

    if (error) {
      console.error(`[email:${label}] Failed to send email (Resend API):`, error);
      return { success: false, message: error.message || 'Failed to send email.', error };
    }

    console.log(`[email:${label}] Email sent successfully: ${data.id}`);
    return { success: true, messageId: data.id, message: 'Email sent successfully.' };
  } catch (error) {
    console.error(`[email:${label}] Failed to send email (Exception):`, error);
    return {
      success: false,
      message: error.message || 'Failed to send email.',
      error,
    };
  }
}

async function sendBookingEmail(userEmail, bookingData) {
  return sendMail(
    {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      replyTo: process.env.ADMIN_CONTACT_EMAIL || undefined,
      subject: 'Booking Confirmation - HostelBloom',
      html: buildBookingEmailHtml(bookingData),
      text: buildBookingEmailText(bookingData),
    },
    'booking-confirmation'
  );
}

async function sendContactEmail(data) {
  return sendMail(
    {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_CONTACT_EMAIL || DEFAULT_ADMIN_CONTACT_EMAIL,
      replyTo: data.email,
      subject: 'New Contact Message - HostelBloom',
      html: buildContactEmailHtml(data),
      text: buildContactEmailText(data),
    },
    'contact-message'
  );
}

async function sendContactAutoReplyEmail(data) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <h2 style="color: #0f766e;">We received your message!</h2>
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thank you for reaching out to HostelBloom. We have received your message and our team will get back to you within 30 minutes.</p>
      <div style="background-color: #f7f1e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin-top: 0; font-weight: bold;">Your Message:</p>
        <p style="font-style: italic;">"${escapeHtml(data.message)}"</p>
      </div>
      <p style="margin-top: 30px; font-size: 0.9em; color: #777;">Best regards,<br>The HostelBloom Team</p>
    </div>
  `;
  const text = `Hi ${data.name},\n\nWe received your message: "${data.message}"\n\nOur team will get back to you within 30 minutes.\n\nBest regards,\nHostelBloom`;

  return sendMail(
    {
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: 'Thank you for contacting HostelBloom',
      html,
      text,
    },
    'contact-auto-reply'
  );
}

module.exports = {
  sendBookingEmail,
  sendContactEmail,
  sendContactAutoReplyEmail,
};
