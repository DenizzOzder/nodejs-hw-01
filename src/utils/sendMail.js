import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT || 587);
const secure = port === 465; // 465 → SSL/TLS, 587 → STARTTLS

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure, // 587 → false, 465 → true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Render'da uzun beklemeleri engellemek için makul timeoutlar
  connectionTimeout: 12000, // TCP bağlantı için
  socketTimeout: 12000, // veri alışverişi için
  greetingTimeout: 7000, // SMTP banner bekleme
  requireTLS: !secure, // 587 kullanırken STARTTLS zorunlu olsun
  // Bazı platformlarda SNI ile host adı belirtmek iyi olur
  tls: { servername: process.env.SMTP_HOST },
});

export const sendMail = async (options) => {
  // options: { from, to, subject, html, text? }
  return transporter.sendMail(options);
};
