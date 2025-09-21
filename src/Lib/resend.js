import "dotenv/config";
import { Resend  } from "resend";

const resendClient = new Resend(process.env.RESEND_API);

const sender = {
  email: process.env.EMAIL_FROM,
  name: process.env.EMAIL_FROM_NAME,
};

export { resendClient, sender };
