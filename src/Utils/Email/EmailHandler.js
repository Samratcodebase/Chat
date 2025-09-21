import { resendClient, sender } from "../../Lib/resend.js";
import { createWelcomeEmailTemplate } from "./EmailTemplates.js";
const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, err } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,  //change this mail to resend  singed up email
    subject: "Welcome to ChatApp",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (err) {
    console.log("Error Sending Email");
  } else {
    console.log("Welcome Email Send", data);
  }
};

export { sendWelcomeEmail };
