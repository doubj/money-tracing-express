const express = require('express');
const Record = require('../models/record');

var route = express.Router()

route.get('/', (req, res) => {
  const pageIndex = req.params._page || 1
  const pageSize = req.params._limit || 300000
  Record.find({})
    .skip((pageIndex - 1) * pageSize)
    .limit(pageSize)
    .sort('-timestamp')
    .exec(function (err, records) {
      if (err) {
        console.log(err)
      } else {
        Record.count({}, function(err2, count) {
          if (err2) {
            console.log(err2)
          } else {
            res.send({
              list: records,
              total: count
            })
          }
        }) 
      }
    })
})

route.get('/total', (req, res) => {
  Record.find({})
    .populate('cid')
    .exec(function(err, records) {
      if (err) {
        console.log('11', err)
      } else {
        let balance = 0
        records.forEach(record => {
          balance = balance + (record.cid.type === 'expense' ? (-record.price) : record.price)
        })
        res.send({balance})
      }
    })
})

route.post('/', (req, res) => {
  const record = new Record({ ...req.body })
  record.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.status(201).send(record)
    }
  })
})

route.put('/:id', (req, res) => {
  Record.findByIdAndUpdate(req.params.id, { ...req.body, category: req.body.cid }, function (err, doc) {
    if (err) {
      console.log(err)
    } else {
      res.status(204).send()
    }
  })
})

route.delete('/:ids', (req, res) => {
  const ids = req.params.ids.split(',')
  Record.deleteMany({_id: {$in: ids}}, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.status(204).send()
})

module.exports = route