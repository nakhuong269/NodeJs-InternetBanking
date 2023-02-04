import express from "express";
import * as genericModel from "../models/generic.model.js";

const router = express.Router();

router.get("/GetInfoUser/:accountNumber", async (req, res) => {
  const accountNumber = req.params.accountNumber || 0;

  const data = await genericModel.GetInfoUserByAccountNumber(accountNumber);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get info user failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get info user succesfully",
  });
});

router.post("/InternalTransfer", async (req, res) => {
  const transaction = req.body;

  const data = await genericModel.InternalTransfer(transaction);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Internal transfer failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Internal transfer succesfully",
  });
});

router.get("/ListBank", async (req, res) => {
  const data = await genericModel.getListBank();

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get list bank failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list bank succesfully",
  });
});

router.get("/ListPaymentType", async (req, res) => {
  const data = await genericModel.getListPaymentType();

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get list payment type failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list payment type succesfully",
  });
});

export default router;
