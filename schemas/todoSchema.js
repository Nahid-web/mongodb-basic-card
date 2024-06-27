const mongoose = require("mongoose");

const toDoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

//instance method
toDoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
  findActiveCallback: function (cb) {
    return mongoose.model("Todo").find({ status: "active" }, cb);
  },
};

//static method
toDoSchema.statics = {
  findByMongodb: function () {
    return this.find({ description: /mongodb/i });
  },
};

module.exports = toDoSchema;
