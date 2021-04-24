const express = require("express");
const app = express();

const InitManager = require("./core/init");
InitManager.initCore(app);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`express is listening at http://localhost:${port}`);
});
