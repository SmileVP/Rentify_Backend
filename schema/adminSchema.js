const mongoose = require("mongoose");



//schema to visualize how a database should be structured
const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    status: { type: String, default: "y" },
    role: { type: String, default: "Admin" },
    createdAt: { type: Date, default: Date.now() },
  },{ versionKey: false, collection: "Admin" }
);

//model provides an interface to the database for creating, querying, updating, deleting records, etc.
const adminModel = mongoose.model("Admin", adminSchema);
module.exports = { adminModel };
