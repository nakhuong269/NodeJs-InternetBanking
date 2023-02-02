import express from "express";
import * as employeeModel from "../models/employee.model.js";

const router = express.Router();

router.post("/recharge", async (req, res) => {
  const transaction = req.body;

  const data = await employeeModel.recharge(transaction);
  console.log(data);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Recharge failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Recharge succesfully",
  });
});

router.get("/ListTransaction/:accountNumber", async (req, res) => {
  const accountNumber = req.params.accountNumber || 0;

  const data = await employeeModel.getListTransactionByAccountNumber(
    accountNumber
  );

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get list transaction failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list transaction succesfully",
  });
});

export default router;
