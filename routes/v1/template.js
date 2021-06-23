const express = require("express");
const Template = require(`${process.cwd()}/models/template`);
const Utils = require(`${process.cwd()}/utils`)

var route = express.Router();

route.get("/", async (req, res) => {
  const { where, page, limit } = Utils.resetRequestQuery(req.query);
  const list = await Template.find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort("-timestamp")
    .populate("category")
    .exec();
  const total = await Template.countDocuments(where);
  res.send({ list, total });
});

route.post("/", async (req, res) => {
  const template = new Template({ ...req.body, category: req.body.category.id });
  const { id } = await template.save();
  res.status(201).send({ ...req.body, id });
});

route.put("/:id", async (req, res) => {
  await Template.findByIdAndUpdate(req.params.id, {
    ...req.body,
    category: req.body.category.id
  });
  res.status(204).send();
});

route.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Template.deleteMany({ _id: { $in: id } });
  res.status(204).send();
});


module.exports = route;