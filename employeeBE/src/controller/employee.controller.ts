import { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service";

const employeeService = new EmployeeService();

export class EmployeeController {

  async create(req: Request, res: Response) {
    try {
      console.log("Employee created:", req.body);
      const employee = await employeeService.createEmployee(req.body);
      console.log("Employee created successfully:", employee);
      return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: employee,
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Internal server error";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      console.log('get employees')
      const employees = await employeeService.getAllEmployees();
      console.log('Employee list: ', employees)
      return res.status(200).json({
        success: true,
        data: employees,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch employees",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      const employee = await employeeService.getEmployeeById(id);

      return res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Internal server error";

      return res.status(message === "Employee not found" ? 404 : 500).json({
        success: false,
        message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      const employee = await employeeService.updateEmployee(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: employee,
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Internal server error";

      return res.status(message === "Employee not found" ? 404 : 400).json({
        success: false,
        message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      const result = await employeeService.deleteEmployee(id);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Internal server error";

      return res.status(message === "Employee not found" ? 404 : 500).json({
        success: false,
        message,
      });
    }
  }
}