import express from "express";
import morgan from "morgan";
import asyncError from "express-async-errors";

// import router
import bankRouter from "./src/routes/bank.route.js";
import accountRouter from "./src/routes/account.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ msg: "Hello world" });
});

// use router
app.use("/api/bank", bankRouter);
app.use("/api/account", accountRouter);

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
