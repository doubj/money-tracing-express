const express = require('express');
const Record = require(`${process.cwd()}/models/record`);

var route = express.Router()

route.get('/', async (req, res) => {
  const pageIndex = req.params._page || 1
  const pageSize = req.params._limit || 300000
  const list = await Record.find({})
    .skip((pageIndex - 1) * pageSize)
    .limit(pageSize)
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