import { text } from "express";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

//has to be async
const sendEmail = async (options) => {

  //default mailgen branding
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task manager",
      link: "https://taskmanagerlink.com",
    },
  });
  //converts content into plaintext/html EMAIL
  const emailTextualContent = mailGenerator.generatePlaintext(
    options.mailgenContent, 
  );
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  //transporter object that takes ur email nd send it
  const transporter=nodemailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: process.env.MAIL_TRAP_PORT,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });

  const mail={
    from:"mail.taskmanager@example.com",
    to:options.email,
    subject:options.subject,
    text:emailTextualContent,
    html:emailHtml
  }

  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error("email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file")
    console.error("Error: ",error)
  }
};

//content template
const emailVerifContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "welcome to our app! We are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button.",
        button: {
          color: "#5a1d7b",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have queries? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPswdfContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "we got a request to reset the password of your account.",
      action: {
        instructions: "To reset your password, click on the following button.",
        button: {
          color: "#5a1d7b",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have queries? Just reply to this email, we'd love to help.",
    },
  };
};

export { emailVerifContent, forgotPswdfContent, sendEmail };
