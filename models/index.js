import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user.js";
import config from "../config/config.js";
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const db = {};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      dialect: "postgres",
      logging: false,
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = UserModel(sequelize, DataTypes);

export default db;
