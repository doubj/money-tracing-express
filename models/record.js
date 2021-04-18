const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RecordSchema = new Schema(
  {
    date: {type: String, required: true, max: 10},
    price: {type: Number, required: true},
    description: {type: String, required: true, max: 500},
    timestamp: {type: Number, required: true},
    cid: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
  }
);

RecordSchema.options.toJSON = {
  transform(doc, ret, options) {
    virtuals: true,
      ret.id = doc.id;
      delete ret._id;
      return ret;
  }
}


module.exports = mongoose.model('Record', RecordSchema)