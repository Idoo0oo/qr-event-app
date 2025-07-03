const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const brevoTransport = require('nodemailer-brevo-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(
  new brevoTransport({
    apiKey: process.env.BREVO_API_KEY,
  })
);

exports.sendInvitationEmail = async (guest) => {
  try {
    // [PERBAIKAN 1] Ubah dari toDataURL menjadi toBuffer
    // Kita akan membuat gambar sebagai data mentah (buffer), bukan string base64
    const qrCodeBuffer = await qrcode.toBuffer(guest.id, { width: 300, margin: 1 });

    const mailOptions = {
      from: `"QR Event Admin" <${process.env.EMAIL_USER}>`,
      to: guest.email,
      subject: 'Your QR Code Invitation',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Hello, ${guest.name}!</h2>
          <p>Thank you for registering. Please use this QR code to check in at the event.</p>
          <div style="margin: 30px 0;">
            <img src="cid:qrcode_image" alt="Your QR Code" />
          </div>
          <p>We look forward to seeing you!</p>
        </div>
      `,
      // [PERBAIKAN 3] Lampirkan gambar sebagai inline attachment dengan CID
      attachments: [
        {
          filename: 'qr-code.png',
          content: qrCodeBuffer,
          cid: 'qrcode_image' // Content-ID yang sama dengan src di atas
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${guest.email} via Brevo with attachment.`);
  } catch (error) {
    console.error(`Error sending email to ${guest.email}:`, error);
  }
};