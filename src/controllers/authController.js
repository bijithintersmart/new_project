
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export const register = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const image = req.file ? req.file.path : null;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password, name, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, hashedPassword, name, image]
    );

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userData } = newUser.rows[0];

    res.status(201).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error registering user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password: _, ...userData } = user;
      res.json({ token, user: userData });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error registering user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, image } = req.body;
    const updatedUser = await User.update(req.user.username, name, image);

    if (result.rows.length > 0) {
      res.json({
        message: "User updated successfully",
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
    });
  }
};
