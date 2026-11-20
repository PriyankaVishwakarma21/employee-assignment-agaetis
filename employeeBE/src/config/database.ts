import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Employee } from "../entities/employee";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [Employee],

  synchronize: process.env.NODE_ENV !== "production",
//   logging: process.env.NODE_ENV === "development",
});