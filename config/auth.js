//bcrypt for hashing password
const bcrypt = require("bcryptjs");

//jwt for authentication
const jwt = require("jsonwebtoken");

require('dotenv').config()


//Hashing to turn password (or any other piece of data) into a short string of letters and/or numbers using an encryption algorithm.
const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

//hashCompare returns true or false
const hashCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

//firstName,lastName, email, role all this are payload sent as object
const createToken = ({ firstName, lastName, email }) => {
  let token = jwt.sign({ firstName, lastName, email},process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE,
  });
 
  return token;
 
};

//for decoding token
const decodeToken = (token) => {
  let data = jwt.decode(token);
  return data;
};


//middleware function for token expiration
const validate = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
       let token = req.headers.authorization.split(" ")[1];
      let data = decodeToken(token);
      // divide by 1000 to change into seconds 
      if (Math.floor(Date.now() / 1000) <= data.exp) {
        next()
      } else {
        res.status(401).send({
          message: "Token expired",
        });
      }
    
    } 
  } catch (error) {
    res.send({
      message: "Internal server error",
      error,
    });
  }
};

//decode forgot password token
const decodePasswordToken = (token) => {
  let data = jwt.decode(token);
  return data;
};

//middleware function for role admin authentication
const roleAdmin= async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        let data = decodeToken(token);
        if (data.role==='admin') {
          next()
        } else {
          res.status(401).send({
            message: "only admin can access",
          });
        }
      } else {
        res.status(401).send({
          message: "Token not found",
        });
      }
    } catch (error) {
      res.send({
        message: "Internal server error",
        error,
      });
    }
  };



module.exports = {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  decodePasswordToken,
  validate,
  roleAdmin
};
