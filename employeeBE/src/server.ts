import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { AppDataSource } from "./config/database";

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();

    console.log("MySQL database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
}

bootstrap();