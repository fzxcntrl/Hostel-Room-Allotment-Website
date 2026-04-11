const nodemailer = require('nodemailer');

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const DEFAULT_ADMIN_CONTACT_EMAIL = 'hostelblooom@gmail.com';

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT || 10000),
    greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT || 10000),
    socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT || 15000),
  });

  return transporter;
}

function getEmailConfigError() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return 'Email service is not configured. Set EMAIL_USER and EMAIL_PASS in the backend environment.';
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

function buildRenderSmtpHint(error) {
  if (process.env.RENDER && error?.code === 'ETIMEDOUT') {
    return 'Render free web services block outbound SMTP ports 25, 465, and 587. Upgrade the service or switch to an email API provider to send production emails from Render.';
  }

  return null;
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
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`[email:${label}] Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId, message: 'Email sent successfully.' };
  } catch (error) {
    const hint = buildRenderSmtpHint(error);

    console.error(`[email:${label}] Failed to send email:`, error);
    if (hint) {
      console.error(`[email:${label}] ${hint}`);
    }

    return {
      success: false,
      message: hint || error.message || 'Failed to send email.',
      error,
    };
  }
}

async function sendBookingEmail(userEmail, bookingData) {
  return sendMail(
    {
      from: `"HostelBloom" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      replyTo: process.env.ADMIN_CONTACT_EMAIL || process.env.EMAIL_USER,
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
      from: `"HostelBloom Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_CONTACT_EMAIL || DEFAULT_ADMIN_CONTACT_EMAIL,
      replyTo: data.email,
      subject: 'New Contact Message - HostelBloom',
      html: buildContactEmailHtml(data),
      text: buildContactEmailText(data),
    },
    'contact-message'
  );
}

module.exports = {
  sendBookingEmail,
  sendContactEmail,
};
