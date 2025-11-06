import nodemailer from 'nodemailer'

export const sendMail = async (options) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'IT Support <it@company.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transport.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Email sending error:', error);
  }
};
