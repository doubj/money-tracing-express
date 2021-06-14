var jwt = require('jsonwebtoken');
const express = require("express");

var route = express.Router();

route.post("/login", async (req, res, next) => {
  const { password, userName } = req.body;
  if (password === 'admin123' && userName === 'admin') {
    const { secretKey } = global.config.auth;
    const token = jwt.sign({}, secretKey, { expiresIn: '3h' });
    res.send({token});
  } else {
    next(new global.errs.LoginException('用户名密码不匹配，请重新输入!'))
  }
});

module.exports = route;
