module.exports = {
  environment: 'prod',
  port: 3010,
  errorMessage: '服务器开小差了，请刷新或重试！',
  db: {
    url: 'mongodb://doubj:doubj1234@42.192.49.233:27017/money_tracing'
  },
  auth: {
    secretKey: 'doubj'
  }
}