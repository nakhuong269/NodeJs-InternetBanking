import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import db from "../utils/db.js";

const app = express();
const httpServer = createServer(app);

app.use("/", (req, res) => {
  res.send("Hello from socket.io");
});

httpServer.listen(process.env.SOCKET_PORT || 4765, () => {
  console.log(`Socket listening on port ${process.env.SOCKET_PORT || 4765}`);
});

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://node-js-internet-banking.vercel.app",
    ],
  },
});

var users = [];

io.on("connection", function (socket) {
  socket.on("connected", function (userId) {
    console.log(userId);
    console.log("a new client connected");
    users[userId] = socket.id;
  });
});

//cancel debt remind
export async function cancelDebtSocket(idDebt, idUser) {
  try {
    const idUserSend = await db("debt_remind")
      .where("debt_remind.ID", idDebt)
      .join(
        "account_payment",
        "account_payment.AccountNumber",
        "=",
        "debt_remind.AccountPaymentSend"
      )
      .select(["account_payment.AccountID"]);
    const idUserReceive = await db("debt_remind")
      .where("debt_remind.ID", idDebt)
      .join(
        "account_payment",
        "account_payment.AccountNumber",
        "=",
        "debt_remind.AccountPaymentReceive"
      )
      .select(["account_payment.AccountID"]);

    if (idUserSend[0].AccountID == idUser) {
      console.log("TRue");
      console.log(users[idUserReceive[0]]);
      return await io
        .to(users[idUserReceive[0].AccountID])
        .emit("server_cancel_debt", idDebt, true);
    } else if (idUserReceive[0].AccountID == idUser) {
      console.log("FALSE");
      console.log(users[idUserSend[0]]);
      return await io
        .to(users[idUserSend[0].AccountID])
        .emit("server_cancel_debt", idDebt, false);
    }
  } catch (err) {
    throw err;
  }
}

//cancel debt remind
export async function createDebtSocket(idDebt) {
  try {
    const idUserReceive = await db("debt_remind")
      .where("debt_remind.ID", idDebt)
      .join(
        "account_payment",
        "account_payment.AccountNumber",
        "=",
        "debt_remind.AccountPaymentReceive"
      )
      .select(["account_payment.AccountID"]);

    return await io
      .to(users[idUserReceive[0].AccountID])
      .emit("server_create_debt", idDebt);
  } catch (err) {
    throw err;
  }
}

export async function paymentDebtSocket(idDebt) {
  const idUserSend = await db("debt_remind")
    .where("debt_remind.ID", idDebt)
    .join(
      "account_payment",
      "account_payment.AccountNumber",
      "=",
      "debt_remind.AccountPaymentSend"
    )
    .select(["account_payment.AccountID"]);

  if (idUserSend.length === 0) {
    return null;
  }

  console.log(idUserSend[0].AccountID);
  console.log(users[idUserSend[0].AccountID]);

  return await io
    .to(users[idUserSend[0].AccountID])
    .emit("server_payment_debt", idDebt);
}

export async function transactionSocket(idTrans) {
  const idUserReceive = await db("transaction")
    .where("transaction.ID", idTrans)
    .join(
      "account_payment",
      "account_payment.AccountNumber",
      "=",
      "transaction.AccountPaymentReceive"
    )
    .select(["account_payment.AccountID"]);

  if (idUserReceive.length === 0) {
    return null;
  }
  return await io
    .to(users[idUserReceive[0].AccountID])
    .emit("server_transaction", idTrans);
}

export default io;
