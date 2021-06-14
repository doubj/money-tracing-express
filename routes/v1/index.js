const record = require("./record");
const category = require("./category");
const template = require("./template");
const user = require("./user");

module.exports = (app) => {
  app.use("/api/v1/record", record);
  app.use("/api/v1/category", category);
  app.use("/api/v1/template", template);
  app.use("/api/v1/user", user);
};
