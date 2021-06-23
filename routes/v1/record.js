const express = require("express");
const Record = require(`${process.cwd()}/models/record`);
const Utils = require(`${process.cwd()}/utils`)

var route = express.Router();

route.get("/", async (req, res) => {
  const { where, page, limit } = Utils.resetRequestQuery(req.query);
  const list = await Record.find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort("-date -timestamp")
    .populate('category')
    .exec();
  const total = await Record.countDocuments(where);
  res.send({ list, total });
});

route.get("/total", async (req, res) => {
  const records = await Record.find({}).populate("category").exec();
  let balance = 0;
  records.forEach((record) => {
    balance =
      balance + (record.category.type === "expense" ? -record.price : record.price);
  });
  res.send({ balance });
});

// route.get("/description", async (req, res) => {
//   const { where, limit } = Utils.resetRequestQuery(req.query);
//   const list = await Record.find(where, 'description cid')
//     .limit(limit)
//     .sort("-date")
//     .exec();
//   res.send(list);
// });

route.post("/", async (req, res) => {
  const record = new Record({ ...req.body, category: req.body.category.id });
  const { id } = await record.save();
  res.status(201).send({ ...req.body, id });
});

route.put("/:id", async (req, res) => {
  await Record.findByIdAndUpdate(req.params.id, {
    ...req.body,
    category: req.body.category.id
  });
  res.status(204).send();
});

route.delete("/:ids", async (req, res) => {
  const ids = req.params.ids.split(",");
  await Record.deleteMany({ _id: { $in: ids } });
  res.status(204).send();
});

module.exports = route;
