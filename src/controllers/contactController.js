// src/controllers/contactController.js
import AppError from "../utils/appError.js";
import db from "../../models/index.js";

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
