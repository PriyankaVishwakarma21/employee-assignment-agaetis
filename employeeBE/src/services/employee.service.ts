import { employeeRepository } from "../repositories/employee.repository";
import { Employee } from "../entities/employee";

export class EmployeeService {

  async createEmployee(data: Partial<Employee>) {
    const existingEmployee = await employeeRepository.findOne({
      where: { email: data.email },
    });

    if (existingEmployee) {
      throw new Error("Employee email already exists");
    }

    const employee = employeeRepository.create(data);

    return await employeeRepository.save(employee);
  }

  async getAllEmployees() {
    return await employeeRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async getEmployeeById(id: number) {
    const employee = await employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  async updateEmployee(id: number, data: Partial<Employee>) {
    const employee = await this.getEmployeeById(id);

    if (data.email && data.email !== employee.email) {
      const existing = await employeeRepository.findOne({
        where: { email: data.email },
      });

      if (existing) {
        throw new Error("Employee email already exists");
      }
    }

    employeeRepository.merge(employee, data);

    return await employeeRepository.save(employee);
  }

  async deleteEmployee(id: number) {
    const employee = await this.getEmployeeById(id);

    await employeeRepository.remove(employee);

    return { message: "Employee deleted successfully" };
  }
}