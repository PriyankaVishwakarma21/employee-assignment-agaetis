import { Router } from "express";
import { EmployeeController } from "../controller/employee.controller";

const router = Router();
const employeeController = new EmployeeController();

router.post("/", (req, res) => employeeController.create(req, res));

router.get("/", (req, res) => employeeController.getAll(req, res));

// router.get("/:id", (req, res) => employeeController.getById(req, res));

router.put("/:id", (req, res) => employeeController.update(req, res));

router.delete("/:id", (req, res) => employeeController.delete(req, res));

export default router;