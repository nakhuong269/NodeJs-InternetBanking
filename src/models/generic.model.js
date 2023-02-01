import db from "../utils/db.js";

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
    const result = await trx("transaction").insert(transaction);
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
