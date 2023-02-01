import db from "../utils/db.js";
import { register } from "./account.model.js";

export async function GetListEmployee() {
  const rows = await db("account")
    .join("role", "role.ID", "=", "account.role")
    .where("role.Name", "Employee")
    .join("user", "account.ID", "=", "user.ID")
    .select([
      "account.ID",
      "user.Name",
      "user.Email",
      "user.Phone",
      "user.IDCard",
      "user.CreatedDate",
    ]);

  if (rows.length === 0) {
    return null;
  }

  return rows;
}

export async function addEmployee(employee) {
  return await register(employee);
}

export function updateEmployee(id, employee) {
  return db("user").where("ID", id).update(employee);
}

export async function deleteEmployee(id) {
  return (
    (await db("user").where("ID", id).update("IsDeleted", true)) &&
    (await db("account").where("ID", id).update("IsDeleted", true))
  );
}

export async function findAllTransaction() {
  const rows = await db("transaction")
    .where("transactionTypeID", "=", 2)
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
      TransactionTime: "transaction.CreatedDate",
    })
    .orderBy("transaction.CreatedDate", "desc");
  if (rows.length === 0) {
    return null;
  }

  return rows;
}
