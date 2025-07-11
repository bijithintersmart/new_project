import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const pool = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    minifyAliases: true,
  }
);

export default pool;
