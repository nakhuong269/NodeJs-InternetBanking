import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import asyncError from "express-async-errors";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import db from "./src/utils/db.js";

// import router
import genericRouter from "./src/routes/generic.route.js";
import accountRouter from "./src/routes/account.route.js";
import customerRouter from "./src/routes/customer.route.js";
import adminRouter from "./src/routes/admin.route.js";
import employeeRouter from "./src/routes/employee.route.js";

//middleware
import verifyToken from "./src/middlewares/verifyToken.mdw.js";
import {
  authAdmin,
  authEmployee,
  authCutomer,
} from "./src/middlewares/auth.mdw.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
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

// config dot env
config();

app.use(express.json());

//logger
if (process.env.NODE_ENV !== "production") {
  app.use(
    morgan("common", {
      stream: fs.createWriteStream("./src/loggers/access.log", { flags: "a" }),
    })
  );
}
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://node-js-internet-banking.vercel.app",
      "https://76.76.21.123:443",
    ],
  })
);

app.get("/", (req, res) => {
  res.json({ msg: "Hello world" });
});

// use router
app.use("/api/generic", verifyToken, genericRouter);
app.use("/api/account", accountRouter);
app.use("/api/customer", verifyToken, authCutomer, customerRouter);
app.use("/api/admin", verifyToken, authAdmin, adminRouter);
app.use("/api/employee", verifyToken, authEmployee, employeeRouter);

app.post("/", (req, res) => {
  res.status(201).json({
    msg: "data created",
  });
});

app.get("/err", (req, res) => {
  throw new Error("Error!");
});

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something wrong!",
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export { io, users };
