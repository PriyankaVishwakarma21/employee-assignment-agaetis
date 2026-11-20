import { AppDataSource } from "../config/database";
import { Employee } from "../entities/employee";

export const employeeRepository =
  AppDataSource.getRepository(Employee);