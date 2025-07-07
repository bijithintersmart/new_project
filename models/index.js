import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user.js";
import dotenv from "dotenv";
import pool from "../src/db.js";

dotenv.config();

const db = {};
db.sequelize = pool;
db.Sequelize = Sequelize;
db.User = UserModel(pool, DataTypes);

export default db;
