class DefaultException extends Error {
  constructor(message = global.config.errorMessage, code = 10000, status = 500) {
      super()
      this.code = code
      this.status = status
      this.message = message
  }
}

class LoginException extends DefaultException {
  constructor(message, code) {
      super()
      this.code = code || 10004
      this.status = 401
      this.message = message || '登录失效，请重新登录！'
  }
}

module.exports = {
  DefaultException,
  LoginException
}