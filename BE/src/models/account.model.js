import db from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SendMail from "./mail.model.js";

export async function findByIdCard(idCard) {
  const account = await db("user").where("IDCARD", idCard);
  if (account.length === 0) {
    return null;
  }

  return account[0];
}

export async function findByEmail(email) {
  const account = await db("user").where("Email", email);
  if (account.length === 0) {
    return null;
  }

  return account[0];
}

export async function findByPhone(phone) {
  const account = await db("user").where("Phone", phone);
  if (account.length === 0) {
    return null;
  }

  return account[0];
}

export async function register(userInfo) {
  const user = {
    IDCard: userInfo.IDCard,
    Name: userInfo.Name,
    Email: userInfo.Email,
    Phone: userInfo.Phone,
  };
  //create random password 6 character
  const password = (+new Date() * Math.random())
    .toString(36)
    .substring(0, 6)
    .toUpperCase();

  //hash password
  let accountInfo = {
    Username: userInfo.Phone,
    Password: bcrypt.hashSync(password, 10),
    Role: userInfo.Role,
  };

  const trx = await db.transaction();
  try {
    //create user for user and get id user insert
    const accountId = (await trx("user").insert(user, ["ID"]))[0];

    // console.log(accountId);

    accountInfo = {
      ...accountInfo,
      ID: accountId,
    };

    await trx("account").insert(accountInfo);

    //create account payment for account
    const accountPaymentInfo = {
      AccountNumber: userInfo.Phone,
      AccountID: accountId,
    };
    const accountPaymentId = await trx("account_payment").insert(
      accountPaymentInfo
    );
    await trx.commit();

    //SendMail for user
    await SendMail(
      user.Email,
      "Register Scuccessfully",
      "",
      `<Strong><h1>Thank for register</h1></Strong><br><p>Your password : ${password} </p>`
    );

    return accountPaymentId;
  } catch (e) {
    await trx.rollback();
    console.log(e);
    throw e;
  }
}

export async function login(accountInfo) {
  const user = await db("account")
    .select(["ID", "Username", "Password", "Role"])
    .where("Username", accountInfo.Username);
  if (user.length !== 0) {
    if (bcrypt.compareSync(accountInfo.Password, user[0].Password)) {
      const accessToken = jwt.sign(
        { id: user[0].ID, role: user[0].Role },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: "5m" }
      );

      const refreshToken = jwt.sign(
        { id: user[0].ID, role: user[0].Role },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "7d" }
      );

      await db("account")
        .where("Username", accountInfo.Username)
        .update({ RefreshToken: refreshToken });
      return { isLogged: true, accessToken, refreshToken };
    }
    return { isLogged: false };
  }
  return { isLogged: false };
}

export async function isValidRefreshToken(userId, refresh) {
  const row = await db("account")
    .where("ID", userId)
    .andWhere("RefreshToken", refresh);
  if (row.length === 0) {
    return false;
  }
  return true;
}

export async function changePassword(userId, oldPass, newPass) {
  const user = await db("account").where("ID", userId).select(["Password"]);

  if (user.length === 0) {
    return false;
  }
  if (bcrypt.compareSync(oldPass, user[0].Password)) {
    await db("account")
      .where("ID", userId)
      .update({
        Password: bcrypt.hashSync(newPass, 10),
        UpdatedDate: db.fn.now(),
      });

    return true;
  }

  return false;
}

export async function forgotPassword(email) {
  const user = await db("account")
    .join("user", "user.ID", "=", "account.ID")
    .where("user.Email", email)
    .select(["account.ID"]);

  if (user.length === 0) {
    return false;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const optChangePass = {
    OTP: otp,
    AccountID: user[0].ID,
    CreatedDate: db.fn.now(),
    UpdatedDate: db.fn.now(),
  };

  const result = await db("otp").insert(optChangePass);

  if (result.length === 0) {
    return false;
  }

  //SendMail for user
  await SendMail(
    email,
    "Change password",
    "",
    `<Strong><h1>Your otp here to change password</h1></Strong><br><p>OTP : ${otp} </p>`
  );

  return user[0];
}

export async function checkOTPForgotPass(accountID, OTPinfo) {
  const trx = await db.transaction();
  try {
    const resOTP = await db("otp")
      .where("AccountID", "=", accountID)
      .andWhere("IsDeleted", false)
      .select(["ID", "OTP"])
      .orderBy("CreatedDate", "desc");

    if (resOTP.length === 0) {
      return null;
    }

    if (OTPinfo === resOTP[0].OTP) {
      // generate new password and send mail
      //create random password 6 character
      const password = (+new Date() * Math.random())
        .toString(36)
        .substring(0, 6)
        .toUpperCase();

      //hash password
      await trx("account")
        .where("ID", accountID)
        .update({
          Password: bcrypt.hashSync(password, 10),
        });

      const emailUser = await trx("user")
        .where("ID", accountID)
        .select(["Email"]);

      //SendMail for user
      await SendMail(
        emailUser[0].Email,
        "Reset Password",
        "",
        `<Strong><h1>Reset Password Scuccessfully</h1></Strong><br><p>Your new password : ${password} </p>`
      );

      await trx.commit();

      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    await trx.rollback();
    throw error;
  }
}
