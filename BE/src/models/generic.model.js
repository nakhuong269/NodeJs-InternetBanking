import { error } from "ajv/dist/vocabularies/applicator/dependencies.js";
import db from "../utils/db.js";
import SendMail from "./mail.model.js";

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

    const resultGenerateOTP = await trx("otp").insert({
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