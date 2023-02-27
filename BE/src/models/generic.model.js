import db from "../utils/db.js";
import SendMail from "./mail.model.js";
import { transactionSocket } from "./socket.model.js";

export async function GetInfoUserByAccountNumber(accountNumber) {
  const row = await db("account_payment")
    .where("AccountNumber", accountNumber)
    .join("user", "account_payment.AccountID", "=", "user.ID")
    .select(["user.Name", "account_payment.AccountNumber"])
    .limit(1);

  if (row.length === 0) {
    return null;
  }

  return row;
}

export async function InternalTransfer(transaction) {
  const trx = await db.transaction();
  try {
    const transactionID = await trx("transaction").insert(transaction);
    if (transactionID === 0) {
      return null;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await trx("otp").insert({
      OTP: otp,
      TransactionID: transactionID[0],
    });

    //get Email by transaction Id
    const emailUser = await trx("transaction")
      .where("transaction.ID", "=", transactionID[0])
      .join(
        "account_payment",
        "transaction.AccountPaymentSend",
        "=",
        "account_payment.AccountNumber"
      )
      .join("user", "account_payment.AccountID", "=", "user.ID")
      .select({ Email: "user.Email" });

    //Send mail transaction otp for user
    await SendMail(
      emailUser[0].Email,
      "OTP Transaction",
      "",
      `Hi, <br>Please use this below verification code to complete your transaction<br> <h1>${otp}</h1><br>Thank you.`
    );

    await trx.commit();

    return transactionID;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export async function getListBank() {
  const trx = await db.transaction();
  try {
    const result = await trx("bank").select(["ID", "Name"]);
    if (result === 0) {
      return null;
    }
    await trx.commit();

    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export async function getListPaymentType() {
  const trx = await db.transaction();
  try {
    const result = await trx("payment_fee_type").select(["ID", "Name"]);
    if (result === 0) {
      return null;
    }
    await trx.commit();

    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export async function getInfoTransaction(transactionID) {
  const rows = await db("transaction").where("ID", "=", transactionID);

  if (rows.length === 0) {
    return null;
  }
  return rows;
}

export async function checkOTPTransaction(
  transactionID,
  OTPinfo,
  isDebtRemind,
  IdDebt
) {
  const trx = await db.transaction();
  try {
    const resOTP = await db("otp")
      .where("TransactionID", "=", transactionID)
      .andWhere("IsDeleted", false)
      .select(["ID", "OTP"]);

    if (resOTP.length === 0) {
      return null;
    }

    if (OTPinfo.OTP === resOTP[0].OTP) {
      //trừ và công tiên

      //get info transaction
      const transactionInfo = (
        await trx("transaction")
          .where("ID", transactionID)
          .select(["AccountPaymentReceive", "AccountPaymentSend", "Amount"])
      )[0];

      //decrement balance account send
      await trx("account_payment")
        .decrement("Balance", transactionInfo.Amount)
        .where("AccountNumber", transactionInfo.AccountPaymentSend);

      //increment balance account receive
      await trx("account_payment")
        .increment("Balance", transactionInfo.Amount)
        .where("AccountNumber", transactionInfo.AccountPaymentReceive);

      await trx("otp").where("ID", resOTP[0].ID).update({ IsDeleted: true });

      if (isDebtRemind === "true") {
        await trx("transaction").where("ID", transactionID).update({
          UpdatedDate: trx.fn.now(),
          IsDeleted: false,
          IsDebtRemind: true,
        });
        await trx("debt_remind").where("ID", IdDebt).update({ StatusID: 2 });
      }
      await trx("transaction").where("ID", transactionID).update({
        UpdatedDate: trx.fn.now(),
        IsDeleted: false,
      });

      await transactionSocket(transactionID);

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

export async function checkOTPForgotPass(accountID, OTPinfo) {
  const trx = await db.transaction();
  try {
    const resOTP = await db("otp")
      .where("AccountID", "=", AccountID)
      .andWhere("IsDeleted", false)
      .select(["ID", "OTP"]);

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
      const accountInfo = {
        Password: bcrypt.hashSync(password, 10),
      };

      await trx("account").where("ID", accountID).update(accountInfo);

      const emailUser = await trx("account")
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

export async function findAllPaymentAccountById(id) {
  const rows = await db("account_payment")
    .where("IsDeleted", false)
    .andWhere("AccountID", id)
    .select(["ID", "AccountNumber", "Balance"]);

  if (rows.length === 0) {
    return null;
  }

  return rows;
}
