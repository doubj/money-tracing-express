const record = require("./record");
const user = require("./user");

module.exports = (app) => {
  app.use("/api/v2/record", record);
  app.use("/api/v2/user", user);
};
