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
    .exec();
  const total = await Record.countDocuments(where);
  res.send({ data: list, success: true, total, pageSize: limit, current: page });
});

module.exports = route;
