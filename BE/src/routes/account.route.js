import express from "express";
import jwt from "jsonwebtoken";
import registerSchema from "../schemas/register.json" assert { type: "json" };
import loginSchema from "../schemas/login.json" assert { type: "json" };
import refreshTokenSchema from "../schemas/refreshToken.json" assert { type: "json" };
import changePasswordSchema from "../schemas/changePassword.json" assert { type: "json" };
import forgotPasswordSchema from "../schemas/forgotPassword.json" assert { type: "json" };
import verifyOTPResetPasswordSchema from "../schemas/verifyResetPassword.json" assert { type: "json" };
import * as accountModel from "../models/account.model.js";
import validate from "../middlewares/validate.mdw.js";
import verifyToken from "../middlewares/verifyToken.mdw.js";

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  let user = req.body;

  const ret = await accountModel.register(user);

  user = {
    ID: ret[0],
    ...user,
  };

  if (ret === null) {
    return res.status(200).json({
      message: "Register failed",
      success: false,
    });
  }

  return res
    .status(201)
    .json({ data: user, success: true, message: "Register succesfully" });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const accountInfo = req.body;
  const result = await accountModel.login(accountInfo);

  if (result === null) {
    return res.status(400).end();
  }

  if (result.isLogged === true) {
    return res
      .status(200)
      .json({ message: "Login Successfully!", success: true, data: result });
  } else {
    return res.status(200).json({ message: "Login Failed!", success: false });
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

router.post(
  "/forgotPassword",
  validate(forgotPasswordSchema),
  async (req, res) => {
    const email = req.body.Email;

    const result = await accountModel.forgotPassword(email);

    if (result === null || result === false) {
      return res.status(200).json({
        message: "Forgot password failed",
        success: false,
      });
    }

    return res.status(200).json({
      data: result,
      success: true,
      message: "Forgot password succesfully",
    });
  }
);

router.patch(
  "/changePassword",
  verifyToken,
  validate(changePasswordSchema),
  async (req, res) => {
    const passwordInfo = req.body;

    const result = await accountModel.changePassword(
      passwordInfo.userId,
      passwordInfo.currentPassword,
      passwordInfo.newPassword
    );

    if (result === false) {
      return res.status(200).json({
        message: "Change password failed",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Change password succesfully",
    });
  }
);

router.post(
  "/VerifyResetPassword",
  validate(verifyOTPResetPasswordSchema),
  async (req, res) => {
    const otpInfo = req.body;

    const result = await accountModel.checkOTPForgotPass(
      otpInfo.AccountID,
      otpInfo.OTP
    );

    if (result === null || result === false) {
      return res.status(200).json({
        message: "Verify reset password failed",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verify reset password succesfully",
    });
  }
);

export default router;
