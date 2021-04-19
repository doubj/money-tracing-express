class InitManager{

  static initCore(app) {
    InitManager.app = app
    InitManager.initResponse()
    InitManager.initMongoose()
    InitManager.initRoutes()
  }

  static initResponse() {
    const express = require('express')
    InitManager.app.use(express.json());
    InitManager.app.use(express.urlencoded({ extended: false }));
  }

  static initRoutes() {
    const routes = require(`${process.cwd()}/routes/v1`)
    routes(InitManager.app)
  }

  static initMongoose() {
    const mongoose = require('mongoose');
    mongoose.set('useFindAndModify', false);
    const mongoDB = 'mongodb://127.0.0.1/money_tracing';
    mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));
  }
}

module.exports = InitManager