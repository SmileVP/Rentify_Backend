var express = require("express");

var router = express.Router();

//Mongoose to manage relationships between data, has schema validation
const mongoose = require("mongoose");

const { dbUrl } = require("../config/dbconfig");

const { customerModel } = require("../schema/customerSchema");

const {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken
} = require("../config/auth");



//to connect to db
mongoose.connect(dbUrl);

//to create a new customer
router.post("/customer-sign-up", async (req, res) => {
  try {
    let user = await customerModel.findOne({ email: req.body.email });
    if (!user) {
      req.body.password = await hashPassword(req.body.password);
      let doc = new customerModel(req.body);
      await doc.save();
      res.status(201).send({
        message: "Customer added successfully",
      });
    } else {
      res.status(400).send({
        message: "Email already exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
});

//to customer login
router.post("/customer-login", async (req, res) => {
  try {
    let user = await customerModel.findOne({ email: req.body.email });
    if (user) {
      if (await hashCompare(req.body.password, user.password)) {
        let token = await createToken({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
        res.status(200).send({
          message: "Login successful",
          token,
          user,
        });
      } else {
        res.status(400).send({
          message: "Invalid credentials",
        });
      }
    } else {
      res.status(400).send({
        message: "Email Id does not exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
});



module.exports = router;
