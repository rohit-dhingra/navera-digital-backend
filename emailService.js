const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      // secure: process.env.SMTP_SECURE === 'true',
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || "Email Sender"}" <${
          process.env.EMAIL_USER
        }>`,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log("Email sent successfully!");
      console.log("Message ID:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("SMTP connection verified successfully");
      return true;
    } catch (error) {
      console.error("SMTP connection verification failed:", error);
      return false;
    }
  }
}

module.exports = EmailService;
