import express from "express";
import * as adminModel from "../models/admin.model.js";
import verifyToken from "../middlewares/verifyToken.mdw.js";
import updateEmployeeSchema from "../schemas/updateEmployee.json" assert { type: "json" };
import addEmployee from "../schemas/addEmployee.json" assert { type: "json" };
import validate from "../middlewares/validate.mdw.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await adminModel.GetListEmployee();
  if (data === null) {
    return res.status(204).end();
  }
  return res.status(200).json({
    data: data,
    message: "Get List Employee Successfully",
    success: true,
  });
});

router.post("/", validate(addEmployee), async (req, res) => {
  const employee = req.body;

  const data = await adminModel.addEmployee(employee);
  console.log(data);
  if (data !== null) {
    res.status(201).json({
      message: "Add a employee successfully!",
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Add a employee failed!",
      success: false,
    });
  }
});

router.patch("/:id", validate(updateEmployeeSchema), async (req, res) => {
  const id = req.params.id || 0;
  const employee = req.body;

  const data = await adminModel.updateEmployee(id, employee);

  if (data === 1) {
    return res.status(200).json({
      message: "Update a employee successfully!",
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Update a employee failed!",
      success: false,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await adminModel.deleteEmployee(id);

  if (data === 1) {
    return res.status(200).json({
      message: "Delete a employee successfully!",
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Delete a employee failed!",
      success: false,
    });
  }
});

router.get("/GetListTransaction", async (req, res) => {
  const month = req.query.month || 0;
  const year = req.query.year || 0;

  const data = await adminModel.findAllTransaction(month, year);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get list transaction failed",
    });
  }
  return res.status(200).json({
    data: data,
    message: "Get list transaction succesfully",
    success: true,
  });
});

export default router;
