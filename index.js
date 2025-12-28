require("dotenv").config();
const express = require("express");
const cors = require("cors");
const EmailService = require("./emailService");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const emailService = new EmailService();

// Verify SMTP connection on startup (logs result but does not block server)
emailService
  .verifyConnection()
  .then((ok) => {
    if (!ok) {
      console.error(
        "Warning: SMTP verification failed. Emails may not send until configuration is fixed."
      );
    }
  })
  .catch((err) => {
    console.error("SMTP verification error:", err);
  });

// POST /send-email
// Body: { name, email, message }
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields: name, email, message" });
  }

  // Convert to HTML format
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 10px 0;"><strong>Message:</strong></p>
        <p style="margin: 10px 0; white-space: pre-wrap;">${message}</p>
      </div>
    </div>
  `;

  try {
    const result = await emailService.sendEmail({
      to: "hello@naveradigital.com",
      subject: `New Contact from ${name}`,
      html,
    });
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(502).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => res.json({ status: "ok", service: "email-sender" }));

app.listen(PORT, () => {
  console.log(`Email sender server listening on port ${PORT}`);
});
