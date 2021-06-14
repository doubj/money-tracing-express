const express = require("express");

var route = express.Router();

route.get("/currentUser", async (req, res) => {
  res.send({     name: 'Doubj',
  avatar: 'https://default-1300278090.cos.ap-nanjing.myqcloud.com/avatar.png',
  userid: '00000001', });
});

route.post("/login", async (req, res) => {
  const { password, userName, type } = req.body;
  if (password === 'admin123' && userName === 'admin') {
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'admin',
    });
    return;
  }
});

module.exports = route;
