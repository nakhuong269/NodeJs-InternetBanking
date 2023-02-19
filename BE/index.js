import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import asyncError from "express-async-errors";
import socket from "./src/models/socket.model.js";
import fs from "fs";

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

// config dot env
config();

app.use(express.json());

//logger
app.use(
  morgan("common", {
    stream: fs.createWriteStream("./src/loggers/access.log", { flags: "a" }),
  })
);
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:3000",
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
  console.log(err.stack);
  res.status(500).json({
    error: "Something wrong!",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
