import express from "express";
import recipientSchema from "../schemas/recipient.json" assert { type: "json" };
import loginSchema from "../schemas/login.json" assert { type: "json" };
import * as accountModel from "../models/account.model.js";
import validate from "../middlewares/validate.mdw.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", validate(recipientSchema), async (req, res) => {
  let user = req.body;

  const ret = await accountModel.register(user);

  user = {
    ID: ret[0],
    ...user,
  };

  if (ret === null) {
    res.status(200).json({
      message: "Register failed",
      success: false,
    });
  }
  res
    .status(201)
    .json({ data: user, success: true, message: "Register succesfully" });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const accountInfo = req.body;
  const result = await accountModel.login(accountInfo);

  if (result === null) {
    res.status(400).end();
  }

  if (result.isLogged === true) {
    res
      .status(200)
      .json({ message: "Login Successfully!", success: true, data: result });
  } else {
    res.status(200).json({ message: "Login Failed!", success: false });
  }
});

router.post("/forgotPassword", (req, res) => {});

router.post("/resetPassword", (req, res) => {});

export default router;
