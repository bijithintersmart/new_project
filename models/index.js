import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user.js";
import ContactModel from "./contact.js";
import config from "../config/config.js";
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const db = {};

const sequelize = (process.env.DATABASE_URL && process.env.DATABASE_URL !== '')
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

    
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
  console.warn('DATABASE_URL is not set or is empty. Using local database configuration.');
} else {
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = UserModel(sequelize, DataTypes);
db.Contact = ContactModel(sequelize, DataTypes);

export default db;
