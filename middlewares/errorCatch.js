const errorCatch = (error, req, res, next) => {
  const isError = error instanceof Error
  const isDev = global.config.environment === 'dev'
  if (isError) {
    showError(error.name, error, res)
    if (isDev) {
      throw error
    } else {
      // TODO: 向异常记录表增加一条记录
    }
  } else {
    // 未知异常
    const { message, code, status } = error
    res.status(status || 500).send({ message: message || global.config.errorMessage, code: code || 10000 })
  }
}

const showError = (name, error, res) => {
  let errorTemp
  switch (name) {
    case 'UnauthorizedError' :
      const { code: authCode } = error
      let msg = ''
      switch(authCode) {
        case 'credentials_required':
          msg = '请先登录!';
          break;
      }
      errorTemp = new global.errs.LoginException(msg)
      break;
    default :
      errorTemp = new global.errs.DefaultException()
  }
  const { message, code, status } = errorTemp
  res.status(status).send({ message, code })
}

module.exports = errorCatch