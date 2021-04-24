const express = require("express");
const Category = require(`${process.cwd()}/models/category`);

var route = express.Router();

route.get("/", async (req, res) => {
  const categories = await Category.find({});
  res.send({ list: categories });
});

module.exports = route;
