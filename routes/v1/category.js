const express = require("express");
const Category = require(`${process.cwd()}/models/category`);

var route = express.Router();

route.get("/", async (req, res, next) => {
  const categories = await Category.find({}).catch((err) => next(new global.errs.DefaultException(err)));
  res.send(categories);
});

module.exports = route;
