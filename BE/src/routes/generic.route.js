import express from "express";
import * as genericModel from "../models/generic.model.js";

const router = express.Router();

router.get("/GetInfoUser/:accountNumber", async (req, res) => {
  const accountNumber = req.params.accountNumber || 0;

  const data = await genericModel.GetInfoUserByAccountNumber(accountNumber);

  if (data === null) {
    return res.status(204).end();
  }
  res.status(200).json({
    data: data,
  });
});

router.post("/InternalTransfer", async (req, res) => {
  const transaction = req.body;

  const data = await genericModel.InternalTransfer(transaction);

  if (data === null) {
    return res.status(204).end();
  }
  res.status(200).json({
    data: data,
  });
});

export default router;
