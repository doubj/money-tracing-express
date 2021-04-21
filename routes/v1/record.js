const express = require('express');
const Record = require(`${process.cwd()}/models/record`);

var route = express.Router()

const resetRequestQuery = function(query) {
  // 1. 初始化pageInfo
  const pageInfo = {
    page: 1,
    limit: 300000,
    where: {},
    order: {}
  }
  const compareArray = ['$gte', '$gt', '$lte', '$lt']
  const pageArray = ['page', 'limit']
  Object.keys(query).forEach(key => {
    const value = query[key]
    if (key.indexOf('_') !== -1) {
      // key中包含_
      const actualKey = key.split('_')[0]
      const operator = key.split('_')[1]
      if (compareArray.indexOf(operator) !== -1) {
        // 1. 判断范围
        if (!pageInfo.where[actualKey]) {
          pageInfo.where[actualKey] = {}
        }
        pageInfo.where[actualKey][operator] = value
      }
      if (pageArray.indexOf(operator) !== -1) {
        pageInfo[operator] = +value
      }
    }
  })
  return pageInfo
}

route.get('/', async (req, res) => {
  const { where, page, limit } = resetRequestQuery(req.query)
  const list = await Record
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort('-timestamp')
    .exec()
  const total = await Record.countDocuments({})
  res.send({list, total})
})

route.get('/total', async (req, res) => {
  const records = await Record.find({})
    .populate('cid')
    .exec()
  let balance = 0
  records.forEach(record => {
    balance = balance + (record.cid.type === 'expense' ? (-record.price) : record.price)
  })
  res.send({balance})
})

route.post('/', async (req, res) => {
  const record = new Record({ ...req.body })
  const recordNew = await record.save()
  res.status(201).send(recordNew)
})

route.put('/:id', async (req, res) => {
  await Record.findByIdAndUpdate(req.params.id, { ...req.body, category: req.body.cid })
  res.status(204).send()
})

route.delete('/:ids', async (req, res) => {
  const ids = req.params.ids.split(',')
  await Record.deleteMany({_id: {$in: ids}})
  res.status(204).send()
})

module.exports = route