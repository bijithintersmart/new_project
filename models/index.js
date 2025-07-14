import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user.js";
import config from "../config/config.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const db = {};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = UserModel(sequelize, DataTypes);

export default db;
