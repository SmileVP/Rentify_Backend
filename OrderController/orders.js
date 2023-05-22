const express = require('express');
const router = express.Router();
const { OrderModel } = require ('../schema/orderSchema')
const { dbUrl } = require('../config/dbconfig')
const mongoose = require('mongoose');


//to connect mongodb
mongoose.connect(dbUrl)

//to save the order details in db
router.post('/saveOrder', async (req, res) => {
  try {
    let doc = new OrderModel(req.body);
    await doc.save();
    res.status(201).send({
      message: "Order saved successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//to get the order details from db
router.post('/getOrder', async (req, res) => {
  try {
    let products = await OrderModel.find({ email: req.body.email })
    res.status(200).send({
      products
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