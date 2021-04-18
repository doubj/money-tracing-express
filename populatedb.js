var async = require('async')
var Category = require('./models/category')
var Record = require('./models/record')

const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1/money_tracing';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var records = []

function categoryCreate(_category, cb) {
  
  var category = new Category(_category);
       
  category.save(function (err) {
    if (err) {
      console.log('11', err)
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function recordCreate(_record, cb) {
  
  var record = new Record(_record);
       
  record.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Record: ' + record);
    records.push(record)
    cb(null, record)
  }  );
}

function createCategories(cb) {
    async.parallel([
        function(callback) {
          categoryCreate({_id: 'acec6e8688dd4afcaaf00653', icon: 'icon-Food', name: '餐饮', type: 'expense'}, callback);
        }
        ],
        // optional callback
        cb);
}

function createRecords(cb) {
  async.parallel([
      function(callback) {
        recordCreate({date: '2021-04-14', price: 4, description: '1+1+2', timestamp: 1618404160264, cid: categories[0]}, callback);
      }
      ],
      // optional callback
      cb);
}


async.series([
    createCategories,
    createRecords
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('records: '+records);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




