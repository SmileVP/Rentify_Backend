var express = require("express");

var router = express.Router();

//Mongoose to manage relationships between data, has schema validation
const mongoose = require("mongoose");

const { dbUrl } = require("../config/dbconfig");

const jwt = require("jsonwebtoken");
const { passwordEmail } = require("../service/passwordEmail");

const { customerModel } = require("../schema/customerSchema");

const {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  decodePasswordToken,
} = require("../config/auth");

//frontend url
let url = "https://aquamarine-gnome-aca14d.netlify.app";

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

//send email
router.post("/send-email", async (req, res) => {
  try {
    let user = await customerModel.findOne({ email: req.body.email });
    if (user) {
      let firstName = user.firstName;
      let email = user.email;
      //create token
      let token = jwt.sign({ firstName, email }, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRE,
      });
      const setUserToken = await customerModel.findByIdAndUpdate(
        { _id: user._id },
        { token: token }
      );
      await passwordEmail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        message: `${url}/reset-password/${user._id}/${token}`,
      });
      res.status(200).send({
        message: "Email sent successfully",
      });
    } else {
      res.status(400).send({
        message: "Email does not exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//verify token for reset password
router.get("/reset-password/:id/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const data = await decodePasswordToken(token);
    if (Math.floor(Date.now() / 1000) <= data.exp) {
      res.status(200).send({
        message: "Valid user",
      });
    } else {
      res.status(401).send({
        message: "Token expired",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//creating new password
router.post("/change-password/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const password = req.body.password;
    const changePass = await hashPassword(password);
    const updatePassword = await customerModel.updateOne(
      { _id: _id },
      { $set: { password: changePass } }
    );

    res.status(200).send({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

module.exports = router;
