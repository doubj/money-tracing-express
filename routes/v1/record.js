const express = require("express");
const Record = require(`${process.cwd()}/models/record`);
const Utils = require(`${process.cwd()}/utils`)
const mongoose = require('mongoose')

var route = express.Router();

route.get("/", async (req, res, next) => {
  const { where, page, limit } = Utils.resetRequestQuery(req.query);
  const list = await Record.find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort("-date -timestamp")
    .populate('category')
    .exec()
    .catch(err => next(new global.errs.DefaultException(err)));
  const total = await Record.countDocuments(where).catch(err => next(new global.errs.DefaultException(err)));
  res.send({ list, total });
});

route.get("/total", async (req, res, next) => {
  const records = await Record.find({}).populate("category").exec().catch(err => next(new global.errs.DefaultException(err)));
  let balance = 0;
  records.forEach((record) => {
    balance =
      balance + (record.category.type === "expense" ? -record.price : record.price);
  });
  res.send({ balance });
});

route.get("/description", async (req, res, next) => {
  const { where, limit } = Utils.resetRequestQuery(req.query);
  const list = await Record.find(where, 'description cid')
    .limit(limit)
    .sort("-date")
    .exec()
    .catch(err => next(new global.errs.DefaultException(err)));
  res.send(list);
});

route.post("/", async (req, res, next) => {
  const record = new Record({ ...req.body, category: req.body.category.id });
  const { id } = await record.save().catch(err => next(new global.errs.DefaultException(err)));
  res.status(201).send({ ...req.body, id });
});

route.put("/:id", async (req, res, next) => {
  await Record.findByIdAndUpdate(req.params.id, {
    ...req.body,
    category: req.body.category.id
  }).catch(err => next(new global.errs.DefaultException(err)));
  res.status(204).send();
});

route.delete("/:ids", async (req, res, next) => {
  const ids = req.params.ids.split(",");
  await Record.deleteMany({ _id: { $in: ids } }).catch(err => next(new global.errs.DefaultException(err)));
  res.status(204).send();
});

module.exports = route;
