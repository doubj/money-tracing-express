const record = require("./record");
const category = require("./category");
const template = require("./template");

module.exports = (app) => {
  app.use("/v1/record", record);
  app.use("/v1/category", category);
  app.use("/v1/template", template);
};
