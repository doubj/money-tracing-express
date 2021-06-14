const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  price: { type: Number, required: true },
  description: { type: String, required: true, max: 500 },
  remark: { type: String, required: false, max: 500 },
  timestamp: { type: Number, required: true },
  // cid: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

/**
 * 使用id代理_id
 */
TemplateSchema.options.toJSON = {
  transform(doc, ret, options) {
    virtuals: true, (ret.id = doc.id);
    delete ret._id;
    return ret;
  },
};

module.exports = mongoose.model("Template", TemplateSchema);
