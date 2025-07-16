// src/controllers/contactController.js
import AppError from "../utils/appError.js";
import db from "../../models/index.js";
import fs from "fs";
import createTransporter from "../utils/mailClient.js";

const Contact = db.Contact;

export const createContact = async (req, res, next) => {
  try {
    const { name, email, message, phone } = req.body;

    if (!name || !email || !message) {
      return next(new AppError("Name, email, and message are required", 400));
    }

    const newContact = await Contact.create({
      name,
      email,
      message,
      phone,
    });

    const transporter = await createTransporter();
    const emailTemplate = await fs.promises.readFile("public/contact_mail.html", "utf-8");

    const html = emailTemplate
      .replace("{{name}}", name)
      .replace("{{email}}", email)
      .replace("{{phone}}", phone || 'N/A')
      .replace("{{message}}", message);

    await transporter.sendMail({
      to: process.env.EMAIL,
      subject: "New Contact Form Submission",
      html,
    });

    res.status(201).json({
      status: "success",
      data: {
        contact: newContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll();

    res.status(200).json({
      status: "success",
      results: contacts.length,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};
