import pool from "../db.js";

export const User = {
  async findByUsername(username) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0];
  },

  async create(username, password, name, image) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, name, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, hashedPassword, name, image]
    );
    return result.rows[0];
  },

  async update(username, name, image) {
    const result = await pool.query(
      "UPDATE users SET name = $1, image = $2 WHERE username = $3 RETURNING *",
      [name, image, username]
    );
    return result.rows[0];
  },
};
