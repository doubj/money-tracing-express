const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  icon: { type: String, required: true, max: 10 },
  name: { type: String, required: true, max: 255 },
  type: {
    type: String,
    required: true,
    enum: ["expense", "income"],
    defualt: "expense",
  },
});

/**
 * 使用id代理_id
 */
CategorySchema.options.toJSON = {
  transform(doc, ret, options) {
    virtuals: true, (ret.id = doc.id);
    delete ret._id;
    return ret;
  },
};

module.exports = mongoose.model("Category", CategorySchema);
