var express = require("express");

var router = express.Router();

//Mongoose to manage relationships between data, has schema validation
const mongoose = require("mongoose");

const { dbUrl } = require("../config/dbconfig");

const { adminModel } = require("../schema/adminSchema");
const { OrderModel } = require("../schema/orderSchema");
const { ProductModel } = require("../schema/productSchema");

const {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleAdmin,
} = require("../config/auth");

//to connect to db
mongoose.connect(dbUrl);


// admin login
router.post("/adminLogin", async (req, res) => {
  try {
    let user = await adminModel.findOne({ email: req.body.email });

    if (user) {
      if (user.role === "Admin") {
        if (await hashCompare(req.body.password, user.password)) {
          let token = await createToken({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          });

          res.status(200).send({
            message: "Login successful",
            token,
            role: user.role,
            user,
          });
        } else {
          res.status(400).send({
            message: "Invalid Credential",
          });
        }
      } else {
        res.status(400).send({
          message: "only admin can access",
        });
      }
    } else {
      res.status(400).send({
        message: "only admin can access",
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

//to get the order details
router.get("/getOrder", validate, async (req, res) => {
  try {
    let products = await OrderModel.find();

    res.status(200).send({
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//to get the product details
router.get("/getProducts", validate, async (req, res) => {
  try {
    let values = await ProductModel.find();

    res.status(200).send({
      values,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//create product
router.post("/create-product", async (req, res) => {
  try {
    let product = await ProductModel.findOne({ name: req.body.name });

    if (!product) {
      let doc = new ProductModel(req.body);
      await doc.save();
      res.status(201).send({
        message: "Product Added successfully",
      });
    } else {
      res.status(400).send({
        message: "Product already exists",
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

//to change the status of the product
router.post("/order-Status", async (req, res) => {
  try {
    let products = await OrderModel.findByIdAndUpdate(
      { _id: req.body.OrderId },
      { status: req.body.Status }
    );

    res.status(200).send({
      message: "Status changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//to get product details based on id
router.post("/getSingleProduct", async (req, res) => {
  try {
    let values = await ProductModel.findOne({ _id: req.body.id });

    res.status(200).send({
      values,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal server error",
      error,
    });
  }
});

//update products
router.put("/updateProduct/:id", async (req, res) => {
  try {
    let values = await ProductModel.findOne({ _id: req.params.id });

    if (values) {
      let doc = await ProductModel.updateOne(
        { _id: req.params.id },
        { $set: req.body.values }
      );

      res.status(201).send({
        message: "product updated successfully",
        doc,
      });
    } else {
      res.status(400).send({
        message: "Invalid Id",
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

//delete product
router.delete("/deleteProduct/:id", validate, async (req, res) => {
  try {
    let product = await ProductModel.findOne({ _id: req.params.id });

    if (product) {
      let doc = await ProductModel.deleteOne({ _id: req.params.id });

      res.status(201).send({
        message: "Product Deleted successfully",
      });
    } else {
      res.status(400).send({
        message: "Invalid Id",
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

module.exports = router;
