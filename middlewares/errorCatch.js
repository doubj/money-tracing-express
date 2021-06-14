const { DefaultException } = require('../utils/errors')

const errorCatch = async (error, req, res, next) => {
  const isDefaultException = error instanceof DefaultException
  const isUnauthorizedError = error.name === 'UnauthorizedError'
  const isDev = global.config.environment === 'dev'
  if (isDefaultException) {
    // 默认异常处理类
    if (isDev) {
      throw error
    } else {
      // TODO: 向异常记录表增加一条记录
    }
    const responseError = new DefaultException()
    const { message, code, status } = responseError
    res.status(status).send({ message, code })
  } else if (isUnauthorizedError) {
    // 捕获jwt验证传递的error
    const { code: authCode } = error
    let msg = ''
    switch(authCode) {
      case 'credentials_required':
        msg = '请先登录!';
        break;
    }
    const { message, code, status } = new global.errs.LoginException(msg)
    res.status(status).send({ message, code })
  } else {
    // 自定义异常
    const { message, code, status } = error
    res.status(status || 500).send({ message: message || global.config.errorMessage, code: code || 10000 })
  }
}

module.exports = errorCatch