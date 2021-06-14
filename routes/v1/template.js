const express = require("express");
const Template = require(`${process.cwd()}/models/template`);
const Utils = require(`${process.cwd()}/utils`)

var route = express.Router();

route.get("/", async (req, res, next) => {
  const { where, page, limit } = Utils.resetRequestQuery(req.query);
  const list = await Template.find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort("-timestamp")
    .populate("category")
    .exec().catch(err => next(new global.errs.DefaultException(err)));
  const total = await Template.countDocuments(where).catch(err => next(new global.errs.DefaultException(err)));
  res.send({ list, total });
});

route.post("/", async (req, res, next) => {
  const template = new Template({ ...req.body, category: req.body.category.id });
  const { id } = await template.save().catch(err => next(new global.errs.DefaultException(err)));
  res.status(201).send({ ...req.body, id });
});

route.put("/:id", async (req, res, next) => {
  await Template.findByIdAndUpdate(req.params.id, {
    ...req.body,
    category: req.body.category.id
  }).catch(err => next(new global.errs.DefaultException(err)));
  res.status(204).send();
});

route.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await Template.deleteMany({ _id: { $in: id } }).catch(err => next(new global.errs.DefaultException(err)));
  res.status(204).send();
});


module.exports = route;