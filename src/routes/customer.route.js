import express from "express";
import * as customerModel from "../models/customer.model.js";
const router = express.Router();

router.get("/GetListRecipient/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllRecipientByAccountId(id);

  if (data === null) {
    return res.status(204).end();
  }
  res.status(200).json({
    data: data,
  });
});

router.get("/GetListTransaction/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllTransactionByAccountId(id);

  if (data === null) {
    return res.status(204).end();
  }
  res.status(200).json({
    data: data,
  });
});

router.get("/GetListAccountPayment/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllPaymentAccountById(id);

  if (data === null) {
    return res.status(204).end();
  }
  res.status(200).json({
    data: data,
  });
});

router.post("/recipient", async (req, res) => {
  const recipient = req.body;

  const data = await customerModel.addRecipient(recipient);

  if (data !== null) {
    res.status(201).json({
      message: "Add a recipient successfully!",
    });
  } else {
    res.status(400).json({
      message: "Add a recipient failed!",
    });
  }
});

router.patch("/recipient/:id", async (req, res) => {
  const id = req.params.id || 0;
  const recipient = req.body;

  const data = await customerModel.updateRecipient(id, recipient);

  if (data === 1) {
    res.status(200).json({
      message: "Update a recipient successfully!",
    });
  } else {
    res.status(400).json({
      message: "Update a recipient failed!",
    });
  }
});

router.delete("/recipient/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.deleteRecpient(id);

  if (data === 1) {
    res.status(200).json({
      message: "Delete a recipient successfully!",
    });
  } else {
    res.status(400).json({
      message: "Delete a recipient failed!",
    });
  }
});

export default router;
