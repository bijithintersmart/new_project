
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user');

const register = async (req, res) => {
  try {
    const { username, password, name, image } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, name, image });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error registering user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ username }, "your_jwt_secret", {
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

const updateUser = (req, res) => {
  try {
    const { name, image } = req.body;
    const user = users.find((user) => user.username === req.user.username);
    if (user) {
      user.name = name || user.name;
      user.image = image || user.image;
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

module.exports = { register, login, updateUser };
