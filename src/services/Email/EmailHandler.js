import { resendClient, sender } from "../../Lib/resend.js";
import {
  createWelcomeEmailTemplate,
  createVerificationEmailTemplate,
} from "./EmailTemplates.js";
const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, err } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: "lordsamrat85@gmail.com", //change this mail to resend  singed up email
    subject: "Welcome to ChatApp",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (err) {
    console.log("Error Sending Email");
  } else {
    console.log("Welcome Email Send", data);
  }
};
const sendVerificationEmail = async (
  email,
  name,
  clientURL,
  VerificationToken
) => {
  const { data, err } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: "lordsamrat85@gmail.com", //change this mail to resend  singed up email
    subject: "ChatApp Verification Email",
    html: createVerificationEmailTemplate(name, clientURL, VerificationToken),
  });

  if (err) {
    console.log("Error Sending Verification Email");
  } else {
    console.log("Verification  Email Send", data);
  }
};

export { sendWelcomeEmail, sendVerificationEmail };
