const express = require('express')
const Category = require('../models/category');

var route = express.Router()

route.get('/', (req, res) => {
  Category.find({}, function(err, categories) {
    if (err) {
      console.log(err)
    } else {
      res.send({
        list: categories
      })
    }
  })
})

module.exports = route