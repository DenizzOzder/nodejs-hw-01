/*Mail Sunucusuna Bağlanma */
import nodemailer from 'nodemailer';
export const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  try {
    await transporter.verify();
  } catch (error) {
    console.log('SMTP Bağlantı HATASI', error);
  }
  return await transporter.sendMail(options);
};
