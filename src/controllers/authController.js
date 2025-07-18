import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../models/index.js";
import fs from "fs";
import createTransporter from "../utils/mailClient.js";
import messages from "../utils/constants.js";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const image = req.file ? req.file.path : null;

    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: messages.userExitsError });
    }
    const allUsers = await db.User.findAll({
      attributes: ["name", "password"],
    });

    for (let user of allUsers) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(401).json({
          message: messages.passwordAlreadyUsed(user.name),
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
      email,
      password: hashedPassword,
      name,
      image,
    });

    const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userData } = newUser.toJSON();
    const transporter = await createTransporter();
    const escapeHtml = (str) => {
      return str.replace(/[&<>'"\/]/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\'': '&#39;',
        '"': '&quot;',
        '/': '&#x2F;',
      }[tag] || tag));
    };

    const escapedUserName = escapeHtml(newUser.name);
    const escapedUserEmail = escapeHtml(newUser.email);

    const welcomeHtml = await fs.promises
      .readFile("public/account_welcome_mail.html", "utf-8")
      .then((data) =>
        data
          .replace("{{userName}}", escapedUserName)
          .replace("{{userEmail}}", escapedUserEmail)
      );
    await transporter.sendMail({
      to: newUser.email,
      subject: `Welcome ${newUser.name}!,Good to see you`,
      html: welcomeHtml,
    });

    res.status(201).json({
      token,
      user: userData,
      message: messages.loginSuccess,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: messages.serverError });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: messages.emailError });
    }
    if (!password) {
      return res.status(400).json({ message: messages.passwordError });
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ statusCode: 401, message: messages.userNullError });
    }

    const allUsers = await db.User.findAll({
      attributes: ["name", "password"],
    });
    
    //PASSWORD CHECKING 
    // for (let user of allUsers) {
    //   const isMatch = await bcrypt.compare(password, user.password);
    //   if (isMatch) {
    //     return res.status(401).json({
    //       message: messages.loginPasswordError(user.name),
    //     });
    //   }
    // }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ statusCode: 401, message: messages.wrongPassword });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, image: user.image },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const { password: _, ...userData } = user.toJSON();

    return res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: messages.serverError });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;
    const email = req.user.email;

    const existingUser = await db.User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(401).json({
        message: messages.userNullError,
      });
    }

    existingUser.name = name || existingUser.name;
    
    if (image) existingUser.image = image;

    await existingUser.save();

    const { password: _, ...updatedUser } = existingUser.toJSON();
    return res.status(200).json({
      message: messages.userDataUpdate,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: messages.serverError });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

