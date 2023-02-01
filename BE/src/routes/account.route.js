import express from "express";
import recipientSchema from "../schemas/recipient.json" assert { type: "json" };
import loginSchema from "../schemas/login.json" assert { type: "json" };
import * as accountModel from "../models/account.model.js";
import validate from "../middlewares/validate.mdw.js";

const router = express.Router();

router.post("/register", validate(recipientSchema), async (req, res) => {
  let user = req.body;

  const ret = await accountModel.register(user);

  user = {
    ID: ret[0],
    ...user,
  };
  res.status(201).json(user);
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const accountInfo = req.body;
  if (await accountModel.login(accountInfo)) {
    res.status(200).json({ data: true });
  } else {
    res.status(200).json({ data: false });
  }
});

router.post("/forgotPassword", (req, res) => {});

router.post("/resetPassword", (req, res) => {});

export default router;
