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
