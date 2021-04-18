const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const mongoDB = 'mongodb://127.0.0.1/money_tracing';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

const port = 3005
const routes = require('./routes')

routes(app)

app.listen(port, () => {
  console.log(`express is listening at http://localhost:${port}`)
})
