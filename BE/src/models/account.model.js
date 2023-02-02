import db from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  console.log(password);
  //hash password
  const accountInfo = {
    Username: userInfo.Phone,
    Password: bcrypt.hashSync(password, 10),
    Role: userInfo.Role,
  };

  const trx = await db.transaction();
  try {
    //create account for user and get id user insert
    const accountId =
      (await trx("user").insert(user)) &&
      (await trx("account").insert(accountInfo));

    //create account payment for account
    const accountPaymentInfo = {
      AccountNumber: userInfo.Phone,
      AccountID: accountId[0],
    };
    const accountPaymentId = await trx("account_payment").insert(
      accountPaymentInfo
    );
    await trx.commit();
    return accountPaymentId;
  } catch (e) {
    await trx.rollback();
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
        { expiresIn: "60s" }
      );
      console.log(user);
      return { isLogged: true, accessToken };
    }
    return { isLogged: false };
  }
  return { isLogged: false };
}
