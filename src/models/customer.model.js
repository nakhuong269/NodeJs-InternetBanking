import db from "../utils/db.js";
import moment from "moment";

export async function findAllRecipientByAccountId(accountId) {
  const rows = await db("recipient")
    .where("recipient.IsDeleted", false)
    .join("bank", "recipient.BankID", "=", "bank.ID")
    .select({
      ID: "recipient.ID",
      AccountNumber: "recipient.AccountNumber",
      Name: "recipient.Name",
      BankID: "bank.ID",
      BankName: "bank.Name",
    })
    .where("AccountID", accountId);

  if (rows.length === 0) {
    return null;
  }

  return rows;
}

export function addRecipient(recipient) {
  if (recipient.Name) {
    return db("recipient").insert(recipient);
  } else if (
    !recipient.Name ||
    (recipient.Name == "" && recipient.BankID === 1)
  ) {
    const name = db("account_payment")
      .where("AccountNumber", recipient.AccountNumber)
      .join("user", "user.ID", "=", "account_payment.AccountID")
      .select({ Name: "user.Name" });

    recipient.Name = name;
    return db("recipient").insert(recipient);
  }
}

export function updateRecipient(id, recipient) {
  return db("recipient").where("ID", id).update(recipient);
}

export function deleteRecpient(id) {
  return db("recipient").where("ID", id).update("IsDeleted", true);
}

export async function findAllTransactionByAccountId(id) {
  const rows = await db("transaction")
    .where("transaction.AccountPaymentSend", id)
    .orWhere("transaction.AccountPaymentReceive", id)
    .where(
      "transaction.CreatedDate",
      ">=",
      moment(new Date()).subtract(1, "months").format("YYYY-MM-DD HH:mm:ss")
    )
    .join("bank", "transaction.BankID", "=", "bank.ID")
    .join(
      "transaction_type",
      "transaction.TransactionTypeID",
      "=",
      "transaction_type.ID"
    )
    .join(
      "payment_fee_type",
      "transaction.PaymentFeeTypeID",
      "=",
      "payment_fee_type.ID"
    )
    .select({
      ID: "transaction.ID",
      AccountPaymentSend: "transaction.AccountPaymentSend",
      AccountPaymentReceive: "transaction.AccountPaymentReceive",
      Amount: "transaction.Amount",
      Content: "transaction.Content",
      TransferFee: "transaction.TransferFee",
      TransactionName: "transaction_type.Name",
      BankName: "bank.Name",
      PaymentName: "payment_fee_type.Name",
    });
  if (rows.length === 0) {
    return null;
  }

  return rows;
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

//debt remind
