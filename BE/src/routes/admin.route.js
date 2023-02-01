import express from "express";
import * as adminModel from "../models/admin.model.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await adminModel.GetListEmployee();
  if (data === null) {
    return res.status(204).end();
  }
  res.status(200).json({
    data: data,
  });
});

router.post("/", async (req, res) => {
  const employee = req.body;

  const data = await adminModel.addEmployee(employee);
  console.log(data);
  if (data !== null) {
    res.status(201).json({
      message: "Add a employee successfully!",
    });
  } else {
    res.status(400).json({
      message: "Add a employee failed!",
    });
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id || 0;
  const employee = req.body;

  const data = await adminModel.updateEmployee(id, employee);

  if (data === 1) {
    res.status(200).json({
      message: "Update a employee successfully!",
    });
  } else {
    res.status(400).json({
      message: "Update a employee failed!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await adminModel.deleteEmployee(id);

  if (data === 1) {
    res.status(200).json({
      message: "Delete a employee successfully!",
    });
  } else {
    res.status(400).json({
      message: "Delete a employee failed!",
    });
  }
});

router.get("/GetListTransaction", async (req, res) => {
  const data = await adminModel.findAllTransaction();

  if (data === null) {
    return res.status(204).end();
  }
  res.status(200).json({
    data: data,
  });
});

export default router;
