module.exports = {
  environment: 'dev',
  port: 3005,
  errorMessage: '服务器开小差了，请刷新或重试！',
  db: {
    url: 'mongodb://localhost:27017/money_tracing'
  },
  auth: {
    secretKey: 'doubj'
  }
}