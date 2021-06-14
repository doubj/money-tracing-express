const express = require("express");
const errorCatch = require(`${process.cwd()}/middlewares/errorCatch`)
const app = express();

const InitManager = require("./core/init");
InitManager.initCore(app);
app.use(errorCatch)

const port = process.env.PORT || global.config.port;
app.listen(port, () => {
  console.log(`express is listening at http://localhost:${port}`);
});
