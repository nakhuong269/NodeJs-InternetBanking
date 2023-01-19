import express from "express";
import bankModel from "../models/bank.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const list = await bankModel.findAll();

  res.json(list);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id || 0;

  const bank = await bankModel.findById(id);
  if (bank === null) {
    return res.status(204).end();
  }

  res.json(bank);
});

router.post("/", async (req, res) => {
  let entity = req.body;

  const bank = await bankModel.add(entity);
  if (bank === null) {
    return res.status(204).end();
  }

  res.json(bank);
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id || 0;
  const entity = req.body;

  const bank = await bankModel.patch(id, entity);
  if (bank === null) {
    return res.status(204).end();
  }

  res.json(bank);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id || 0;

  const bank = await bankModel.del(id);

  res.json({ msg: "success" });
});

export default router;
