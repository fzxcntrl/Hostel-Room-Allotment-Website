const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBookingEmail = async (userEmail, bookingData) => {
  try {
    const mailOptions = {
      from: `"HostelBloom" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Booking Confirmation - HostelBloom",
      html: `
        <h2>Booking Confirmed ✅</h2>
        <p>Thank you for booking with us!</p>
        <ul>
          <li><strong>Name:</strong> ${bookingData.name}</li>
          <li><strong>Room:</strong> ${bookingData.room}</li>
          <li><strong>Check-in:</strong> ${bookingData.checkIn}</li>
          <li><strong>Check-out:</strong> ${bookingData.checkOut}</li>
          <li><strong>Total Price:</strong> ₹${bookingData.price}</li>
          <li><strong>Booking ID:</strong> ${bookingData.id}</li>
        </ul>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking email successfully sent to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending booking email:", error);
    return false;
  }
};

const sendContactEmail = async (data) => {
  try {
    const mailOptions = {
      from: `"HostelBloom Contact" <${process.env.EMAIL_USER}>`,
      to: "hostelblooom@gmail.com",
      subject: "New Contact Message - HostelBloom",
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Contact email successfully sent from:", data.email);
    return true;
  } catch (error) {
    console.error("Error sending contact email:", error);
    return false;
  }
};

module.exports = {
  sendBookingEmail,
  sendContactEmail
};
