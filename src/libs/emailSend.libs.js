const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSKEY,
//   },
// });

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "e-commerce-api",
    link: "https://github.com/muhammadranju/e-commerce-api",
  },
});

// For more info on how mailgen content work visit https://github.com/eladnava/mailgen#readme
// Generate the plaintext version of the e-mail (for clients that do not support HTML)

// Generate an HTML email with the provided contents

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE, // host for mailtrap
  port: process.env.EMAIL_PORT,
  // secure: true,

  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(options) {
  const emailHtml = mailGenerator.generate(options.mailgenContent);
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  // send mail with defined transport object
  const info = await transporter.sendMail({
    // from: `"Google 👻"${process.env.EMAIL}`, // sender address
    from: `"Google 👻"<mail.demo@gmail.com>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: emailTextual, // plain text body
    html: emailHtml,
  });
  console.log("Message successfully sent at: %s", info.messageId);
}

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
 */
const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the forgot password mail
 */
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

module.exports = {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
