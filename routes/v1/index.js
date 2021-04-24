const record = require("./record");
const category = require("./category");

module.exports = (app) => {
  app.use("/v1/record", record);
  app.use("/v1/category", category);
};
