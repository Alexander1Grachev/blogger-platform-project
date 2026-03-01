import nodemailer from "nodemailer";
import { appConfig } from "../../core/config/config";

/*

export const nodemailerService = {
  async sendEmail(email: string, subject: string, html: string): Promise<boolean> {
    console.log(`Email would be sent to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${html}`);
    return true; // письмо не уходит реально, но confirmation code уже есть в базе
  },
};
*/
export const nodemailerService = {
  async sendEmail(
    email: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: appConfig.EMAIL,
        pass: appConfig.EMAIL_PASS, // App Password (16 символов, без пробелов)
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"Autotest" <${appConfig.EMAIL}>`,
        to: email,
        subject,
        html,
      });

      console.log("📨 Email sent:", info.messageId);
      return !!info.messageId;
    } catch (error) {
      console.error("❌ Email send failed:", error);
      return false;
    }
  },

  async verifyConnection(): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: appConfig.EMAIL,
          pass: appConfig.EMAIL_PASS,
        },
      });

      await transporter.verify();
      console.log("✅ Gmail SMTP connection is OK");
      return true;
    } catch (err) {
      console.error("❌ SMTP connection failed:", err);
      return false;
    }
  },
};