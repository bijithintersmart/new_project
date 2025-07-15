import nodemailer from "nodemailer";

let transporterInstance = null;

const createTransporter = async () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  transporterInstance = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  return transporterInstance;
};
export default createTransporter;
