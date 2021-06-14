const expressJwt = require("express-jwt");
const { secretKey } = global.config.auth;
const jwtAuth = expressJwt({secret: secretKey, algorithms: ['HS256']}).unless({path: ["/api/v1/user/login", "/api/v1/category"]});

module.exports = jwtAuth;
