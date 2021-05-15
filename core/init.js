class InitManager {
  static initCore(app) {
    InitManager.app = app;
    InitManager.initHttp();
    InitManager.initCors();
    InitManager.initMongoose();
    InitManager.initRoutes();
    InitManager.initCategories();
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
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      res.header("X-Powered-By", " 3.2.1");
      res.header("Content-Type", "application/json;charset=utf-8");
      next();
    });
  }

  /**
   * 设置路由
   */
  static initRoutes() {
    const routes = require(`${process.cwd()}/routes/v1`);
    routes(InitManager.app);
  }

  /**
   * 设置mongoose连接
   */
  static initMongoose() {
    const mongoose = require("mongoose");
    mongoose.set("useFindAndModify", false);
    // const IP = "42.192.49.233"
    const IP = "localhost"
    const mongoDB = `mongodb://${IP}/money_tracing`;
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
}

module.exports = InitManager;
