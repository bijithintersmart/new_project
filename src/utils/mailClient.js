import nodemailer from "nodemailer";
import dotEnv from "dotenv";
dotEnv.config();

// Create a test account or replace with real credentials.
const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  console.log("🔐 Test email credentials:");
  console.log(`  User: ${testAccount.user}`);
  console.log(`  Pass: ${testAccount.pass}`);
  console.log(`  Preview URL will appear after sending.`);

  return transporter;
};
export default createTransporter;
