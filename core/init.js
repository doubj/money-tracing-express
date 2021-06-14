class InitManager {
  static initCore(app) {
    InitManager.app = app;
    InitManager.loadConfig();
    InitManager.initHttp();
    InitManager.initCors();
    InitManager.initMongoose();
    InitManager.initAuth();
    InitManager.initRoutes();
    InitManager.initCategories();
    InitManager.loadException();
  }

  /**
   * 设置Request与Response
   */
  static initHttp() {
    const express = require("express");
    InitManager.app.use(express.json());
    InitManager.app.use(express.urlencoded({ extended: false }));
  }

  /**
   * 设置跨域
   */
  static initCors() {
    InitManager.app.all("*", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Content-Type", "application/json;charset=utf-8");
      next()
    });
  }

  static initAuth() {
    const jwtAuth = require(`${process.cwd()}/middlewares/jwtAuth`)
    InitManager.app.use(jwtAuth)
  }

  /**
   * 设置路由
   */
  static initRoutes() {
    const routesV1 = require(`${process.cwd()}/routes/v1`);
    const routesV2 = require(`${process.cwd()}/routes/v2`);
    routesV1(InitManager.app);
    routesV2(InitManager.app);
  }

  /**
   * 设置mongoose连接
   */
  static initMongoose() {
    const mongoose = require("mongoose");
    mongoose.set("useFindAndModify", false);
    const url = global.config.db.url
    const mongoDB = url;
    mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB 连接错误："));
  }

  static async initCategories() {
    const Category = require(`${process.cwd()}/models/category`);
    const categories = await Category.find({});
    if (categories.length === 0) {
      const categoryJson = require(`${process.cwd()}/db/categories.json`)
      if (categoryJson && categoryJson.RECORDS && categoryJson.RECORDS.length > 0) {
        categoryJson.RECORDS.forEach(_category => {
          const category = new Category({ ..._category })
          category.save()
        })
      }
    }
  }

  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.dev.js'
    const config = require(configPath)
    global.config = config
  }

  static loadException() {
    const errors = require(`${process.cwd()}/utils/errors`)
    global.errs = errors
  }
}

module.exports = InitManager;
