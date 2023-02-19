import express from "express";
import jwt from "jsonwebtoken";
import registerSchema from "../schemas/register.json" assert { type: "json" };
import loginSchema from "../schemas/login.json" assert { type: "json" };
import refreshTokenSchema from "../schemas/refreshToken.json" assert { type: "json" };
import * as accountModel from "../models/account.model.js";
import validate from "../middlewares/validate.mdw.js";

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
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

router.post("/refresh", validate(refreshTokenSchema), async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  try {
    const { id, role } = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, {
      ignoreExpiration: true,
    });

    const refresh = await accountModel.isValidRefreshToken(id, refreshToken);

    if (refresh === true) {
      const newAccessToken = jwt.sign(
        { id, role },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: "5m" }
      );

      return res.json({ success: true, accessToken: newAccessToken });
    }
    return res.status(401).json({
      message: "Refresh token is revoked",
    });
  } catch {
    return res.status(401).json({
      message: "Invalid access token",
    });
  }
});

router.post("/forgotPassword", (req, res) => {});

router.post("/resetPassword", (req, res) => {});

export default router;
