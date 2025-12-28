# Email Sender Project

A Node.js project for sending emails using Nodemailer with support for multiple recipients, HTML content, and attachments.

## Features

- Send plain text and HTML emails
- Support for multiple recipients
- File attachments support
- SMTP connection verification
- Environment-based configuration
- Error handling and logging

## Installation

1. Clone or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

## Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` file with your SMTP credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=Your Name
```

### Gmail Setup

If using Gmail, you need to create an **App Password**:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > 2-Step Verification > App passwords
4. Generate a new app password for "Mail"
5. Use this app password in the `EMAIL_PASS` field

### Other SMTP Providers

For other email providers, update the SMTP settings accordingly:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Usage

Run the example script:

```bash
node index.js
```

### Send a Simple Email

```javascript
const EmailService = require('./emailService');

const emailService = new EmailService();

await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello',
  text: 'Plain text message',
  html: '<h1>HTML message</h1>'
});
```

### Send to Multiple Recipients

```javascript
await emailService.sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  subject: 'Multiple Recipients',
  text: 'This goes to multiple people',
  html: '<p>This goes to <strong>multiple people</strong></p>'
});
```

### Send with Attachments

```javascript
await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Email with Attachment',
  text: 'Please find attached',
  html: '<p>Please find <strong>attached</strong></p>',
  attachments: [
    {
      filename: 'document.txt',
      content: 'File content as string'
    },
    {
      filename: 'image.png',
      path: './path/to/image.png'
    }
  ]
});
```

### Verify SMTP Connection

```javascript
const isConnected = await emailService.verifyConnection();
if (isConnected) {
  console.log('SMTP server is ready');
}
```

## API Reference

### EmailService

#### Constructor

```javascript
new EmailService()
```

Creates a new email service instance using environment variables for configuration.

#### Methods

**sendEmail(options)**

Sends an email with the specified options.

Parameters:
- `to` (string | string[]): Recipient email address(es)
- `subject` (string): Email subject
- `text` (string): Plain text content
- `html` (string): HTML content
- `attachments` (array, optional): Array of attachment objects

Returns: Promise with result object containing `success`, `messageId`, and `response` or `error`

**verifyConnection()**

Verifies the SMTP connection.

Returns: Promise<boolean>

## File Structure

```
email-sender-project/
├── emailService.js    # Email service class
├── index.js          # Example usage
├── .env.example      # Environment variables template
├── .env              # Your configuration (not in git)
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
└── README.md         # Documentation
```

## Troubleshooting

**Authentication Error:**
- Make sure you're using an app password, not your regular email password
- Verify your SMTP credentials are correct

**Connection Timeout:**
- Check your SMTP host and port settings
- Ensure your firewall allows outbound connections on the SMTP port

**SSL/TLS Errors:**
- Try changing `SMTP_SECURE` to `true` for port 465
- Use `SMTP_SECURE=false` for port 587

## License

ISC
