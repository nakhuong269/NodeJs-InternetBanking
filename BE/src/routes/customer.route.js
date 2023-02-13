import express from "express";
import * as customerModel from "../models/customer.model.js";
import validate from "../middlewares/validate.mdw.js";
import addRecipientSchema from "../schemas/addRecipient.json" assert { type: "json" };
import updateRecipientSchema from "../schemas/updateRecipient.json" assert { type: "json" };
import addDebtRemindSchema from "../schemas/addDebtRemind.json" assert { type: "json" };

const router = express.Router();

router.get("/GetListRecipient/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllRecipientByAccountId(id);

  if (data === null) {
    return res.status(200).json({
      message: "Get list reccipient failed",
      success: false,
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list recipient successfully",
  });
});

router.get("/GetListTransaction/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllTransactionByAccountId(id);

  if (data === null) {
    return res.status(200).json({
      message: "Get list transaction failed",
      success: false,
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list transaction successfully",
  });
});

router.get("/GetListAccountPayment/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllPaymentAccountById(id);

  if (data === null) {
    return res.status(200).json({
      message: "Get list account payment failed",
      success: false,
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list account payment successfully",
  });
});

router.post("/recipient", validate(addRecipientSchema), async (req, res) => {
  const recipient = req.body;

  const data = await customerModel.addRecipient(recipient);

  if (data !== null) {
    res.status(201).json({
      message: "Add a recipient successfully!",
      success: true,
    });
  } else {
    res.status(200).json({
      message: "Add a recipient failed!",
      success: false,
    });
  }
});

router.patch(
  "/recipient/:id",
  validate(updateRecipientSchema),
  async (req, res) => {
    const id = req.params.id || 0;
    const recipient = req.body;

    const data = await customerModel.updateRecipient(id, recipient);

    if (data === 1) {
      res.status(200).json({
        message: "Update a recipient successfully!",
        success: true,
      });
    } else {
      res.status(200).json({
        message: "Update a recipient failed!",
        success: false,
      });
    }
  }
);

router.delete("/recipient/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.deleteRecpient(id);

  if (data === 1) {
    res.status(200).json({
      message: "Delete a recipient successfully!",
      success: true,
    });
  } else {
    res.status(200).json({
      message: "Delete a recipient failed!",
      success: false,
    });
  }
});

router.get("/DebtRemind/GetListDebtRemindBySelf/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllDebtRemindByAccountId(id);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get list debt remind failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list debt remind successfully",
  });
});

router.get("/DebtRemind/GetListDebtRemindByAnother/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.findAllDebtRemindByAnotherAccountSend(id);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Get list debt remind failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Get list debt remind successfully",
  });
});

router.post("/DebtRemind", validate(addDebtRemindSchema), async (req, res) => {
  const debt = req.body;
  const data = await customerModel.createDebtRemind(debt);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Create deb remind failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Create deb remind succesfully",
  });
});

router.delete("/DebtRemind/:id", async (req, res) => {
  const id = req.params.id || 0;

  const data = await customerModel.cancelDebtRemind(id);

  if (data === null) {
    return res.status(200).json({
      success: false,
      message: "Delete deb remind failed",
    });
  }
  res.status(200).json({
    data: data,
    success: true,
    message: "Delete deb remind succesfully",
  });
});

router.post(
  "/DebtRemind/Payment/:id",
  validate(addDebtRemindSchema),
  async (req, res) => {
    const id = req.params.id;

    const data = await customerModel.debtPayment(id);

    if (data === null) {
      return res.status(200).json({
        success: false,
        message: "Payment deb remind failed",
      });
    }
    res.status(200).json({
      data: data,
      success: true,
      message: "Payment deb remind succesfully",
    });
  }
);

export default router;
