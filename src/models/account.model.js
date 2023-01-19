import db from "../utils/db.js";
import bcrypt from "bcrypt";

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
  //create random password 6 character
  const password = (+new Date() * Math.random())
    .toString(36)
    .substring(0, 6)
    .toUpperCase();

  console.log(password);
  //hash password
  const accountInfo = {
    Username: userInfo.Phone,
    Password: bcrypt.hashSync(password, 10),
  };

  //create account for user and get id user insert
  const accountId = await ((await db("user").insert(userInfo)) &&
    (await db("account").insert(accountInfo)));

  //create account payment for account
  const accountPaymentInfo = {
    AccountNumber: userInfo.Phone,
    AccountID: accountId[0],
  };

  return await db("account_payment").insert(accountPaymentInfo);
}

export async function login(accountInfo) {
  const user = await db("account")
    .select(["Username", "Password"])
    .where("Username", accountInfo.Username);
  if (user.length !== 0) {
    if (bcrypt.compareSync(accountInfo.Password, user[0].Password)) {
      return true;
    }
    return false;
  }
  return false;
}
