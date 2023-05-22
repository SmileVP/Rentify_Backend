const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    products: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    qty: {
      type: String,
      require: true,
    },
    from: {
      type: String,
      require: true,
    },
    to: {
      type: String,
      require: true,
    },
    hours: {
      type: String,
      require: true,
    },
    subTotal: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false, collection: "Orders" }
);

const OrderModel = mongoose.model("Orders", OrderSchema);
module.exports = { OrderModel };
