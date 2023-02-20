import db from "../utils/db.js";
import moment from "moment";
import { InternalTransfer } from "./generic.model.js";
import {
  createDebtSocket,
  cancelDebtSocket,
  paymentDebtSocket,
} from "./socket.model.js";

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
    .where("transaction.IsDeleted", false)
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
      IsDebtRemind: "transaction.IsDebtRemind",
    })
    .orderBy("transaction.CreatedDate", "desc");
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

export async function findAllDebtRemindByAccountId(id) {
  const rows = await db("debt_remind")
    .join(
      "account_payment",
      "debt_remind.AccountPaymentSend",
      "=",
      "account_payment.AccountNumber"
    )
    .join("status", "status.ID", "=", "debt_remind.StatusID")
    .where("account_payment.AccountID", "=", id)
    .andWhere("debt_remind.StatusID", "=", 1)
    .select({
      ID: "debt_remind.ID",
      AccountPaymentSend: "debt_remind.AccountPaymentSend",
      AccountPaymentReceive: "debt_remind.AccountPaymentReceive",
      Amount: "debt_remind.Amount",
      Content: "debt_remind.Content",
      StatusDebt: "status.ID",
      StatusName: "status.Name",
      CreatedDate: "debt_remind.CreatedDate",
    })
    .orderBy("debt_remind.CreatedDate", "desc");
  if (rows.length === 0) {
    return null;
  }

  return rows;
}

export async function findAllDebtRemindByAnotherAccountSend(id) {
  const rows = await db("debt_remind")
    .join(
      "account_payment",
      "debt_remind.AccountPaymentReceive",
      "=",
      "account_payment.AccountNumber"
    )
    .join("status", "status.ID", "=", "debt_remind.StatusID")
    .where("account_payment.AccountID", "=", id)
    .andWhere("debt_remind.StatusID", "=", 1)
    .select({
      ID: "debt_remind.ID",
      AccountPaymentSend: "debt_remind.AccountPaymentSend",
      AccountPaymentReceive: "debt_remind.AccountPaymentReceive",
      Amount: "debt_remind.Amount",
      Content: "debt_remind.Content",
      StatusDebt: "status.ID",
      StatusName: "status.Name",
      CreatedDate: "debt_remind.CreatedDate",
    })
    .orderBy("debt_remind.CreatedDate", "desc");
  if (rows.length === 0) {
    return null;
  }

  return rows;
}

export async function createDebtRemind(debt) {
  const trx = await db.transaction();
  try {
    const result = await trx("debt_remind").insert(debt);
    if (result === 0) {
      return null;
    }
    await trx.commit();

    //send notify socket
    await createDebtSocket(result[0]);

    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export async function cancelDebtRemind(id, idUser) {
  const trx = await db.transaction();
  try {
    const result = await trx("debt_remind")
      .where("ID", "=", id)
      .update({ statusID: 3, IsDeleted: true, UpdatedDate: db.fn.now() });
    if (result === 0) {
      return null;
    }

    await trx.commit();

    //send notify socket
    await cancelDebtSocket(id, idUser);

    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export async function debtPayment(id) {
  const trx = await db.transaction();
  try {
    const debtPaymentInfo = await trx("debt_remind")
      .where("ID", "=", id)
      .select([
        "AccountPaymentSend",
        "AccountPaymentReceive",
        "Amount",
        "Content",
      ]);

    const debtPayment = {
      AccountPaymentSend: debtPaymentInfo[0].AccountPaymentReceive,
      AccountPaymentReceive: debtPaymentInfo[0].AccountPaymentSend,
      Amount: debtPaymentInfo[0].Amount,
      Content: debtPaymentInfo[0].Content,
      TransactionTypeID: 1,
      PaymentFeeTypeID: 1,
      BankID: 1,
    };

    const resultDebtPayment = await InternalTransfer(debtPayment);

    await trx("debt_remind")
      .where("ID", "=", id)
      .update({ UpdatedDate: db.fn.now() });

    await trx.commit();

    await paymentDebtSocket(id);

    return resultDebtPayment;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export async function getInfoDebt(id) {
  return await db("debt_remind")
    .where("debt_remind.ID", id)
    .select([
      "debt_remind.ID",
      "debt_remind.AccountPaymentSend",
      "debt_remind.AccountPaymentReceive",
      "debt_remind.Amount",
      "debt_remind.Content",
      "debt_remind.UpdatedDate",
    ]);
}
