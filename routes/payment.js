var express = require("express");
var router = express.Router();
var Razorpay = require("razorpay");
var crypto = require("crypto");
var KEY_ID = "rzp_test_LTxcoAPHA7vCEk";
var KEY_SECRET = "bedlisp2nregQsD3MUbljYvQ";


//to get the order details
router.post("/order", (req, res) => {
  try {
    let instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

    var options = {
      amount: req.body.amount *100, // amount in the smallest currency unit
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      if (order) {
        res.status(200).send({
          message: "Order created successfully",
          order,
        });
      } else {
        res.status(500).send({
          message: "Server error",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
  
});

//to verify the payment
router.post("/verify", (req, res) => {
  try {
    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;

    var expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === req.body.response.razorpay_signature) {
      res.status(200).send({
        message: "Sign Valid",
      });
    } else {
      res.status(500).send({
        message: "Sign InValid",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
