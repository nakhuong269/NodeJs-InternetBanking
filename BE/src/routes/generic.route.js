import express from "express";
import * as genericModel from "../models/generic.model.js";
import validate from "../middlewares/validate.mdw.js";
import otpSchema from "../schemas/otp.json" assert { type: "json" };
import transactionSchema from "../schemas/transaction.json" assert { type: "json" };

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
  return res.status(200).json({
    data: data,
    success: true,
    message: "Get info user succesfully",
  });
});

router.post(
  "/InternalTransfer",
  validate(transactionSchema),
  async (req, res) => {
    const transaction = req.body;

    const data = await genericModel.InternalTransfer(transaction);

    if (data === null) {
      return res.status(200).json({
        success: false,
        message: "Internal transfer failed",
      });
    }
    return res.status(200).json({
      data: data,
      success: true,
      message: "Internal transfer succesfully",
    });
  }
);

router.get("/ListBank", async (req, res) => {
  const data = await genericModel.getListBank();

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get list bank failed",
    });
  }
  return res.status(200).json({
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
  return res.status(200).json({
    data: data,
    success: true,
    message: "Get list payment type succesfully",
  });
});

router.post(
  "/CheckOTP/:transactionID",
  validate(otpSchema),
  async (req, res) => {
    const transactionID = req.params.transactionID || 0;
    const isDebtRemind = req.query.isDebtRemind || false;
    const idDebt = req.query.idDebt || 0;
    const otp = req.body || 0;

    const data = await genericModel.checkOTPTransaction(
      transactionID,
      otp,
      isDebtRemind,
      idDebt
    );

    if (data === null || data === false) {
      return res.status(200).json({
        success: false,
        message: "OTP is not valid",
      });
    }
    return res.status(200).json({
      data: data,
      success: true,
      message: "OTP is valid",
    });
  }
);

router.get("/Transaction/:transactionID", async (req, res) => {
  const transactionID = req.params.transactionID || 0;

  const data = await genericModel.getInfoTransaction(transactionID);

  if (data === null || data === false) {
    return res.status(200).json({
      success: false,
      message: "Get info transaction failed",
    });
  }
  return res.status(200).json({
    data: data,
    success: true,
    message: "Get info transaction successfully",
  });
});

router.get("/GetListAccountPayment/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await genericModel.findAllPaymentAccountById(id);

  if (data === null) {
    return res.status(200).json({
      message: "Get list account payment failed",
      success: false,
    });
  }
  return res.status(200).json({
    data: data,
    success: true,
    message: "Get list account payment successfully",
  });
});

export default router;
