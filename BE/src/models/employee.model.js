import db from "../utils/db.js";
import { register } from "./account.model.js";
import { InternalTransfer } from "./generic.model.js";
import { findAllTransactionByAccountId } from "./customer.model.js";

export async function registerCustomer(userInfo) {
  return await register(userInfo);
}

export async function recharge(rechargeInput) {
  const trx = await db.transaction();
  try {
    const AccountSend = await trx("account_payment").where(
      "AccountNumber",
      "=",
      rechargeInput.AccountPaymentSend
    );

    const AccountReceive = await trx("account_payment").where(
      "AccountNumber",
      "=",
      rechargeInput.AccountPaymentReceive
    );

    if (Number(AccountSend[0].Balance) >= Number(rechargeInput.Amount)) {
      const balanceAccountSend =
        Number(AccountSend[0].Balance) - Number(rechargeInput.Amount);

      //deduction
      await trx("account_payment")
        .where("AccountNumber", "=", rechargeInput.AccountPaymentSend)
        .update({
          Balance: balanceAccountSend,
        });

      const balanceAccountReceive =
        Number(AccountReceive[0].Balance) + Number(rechargeInput.Amount);

      // plus money
      await trx("account_payment")
        .where("AccountNumber", "=", rechargeInput.AccountPaymentReceive)
        .update({
          Balance: balanceAccountReceive,
        });
    } else {
      return {
        message: "Not enough balance",
        success: false,
      };
    }

    const rechargeInfo = { ...rechargeInput, IsDeleted: false };

    const transactionId = await trx("transaction").insert(rechargeInfo);

    await trx.commit();
    return {
      data: transactionId,
      message: "Transaction successfully",
      success: true,
    };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

export async function getListTransactionByAccountNumber(accountNumber) {
  return await findAllTransactionByAccountId(accountNumber);
}
