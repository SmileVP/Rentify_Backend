//bcrypt for hashing password
const bcrypt = require("bcryptjs");

//jwt for authentication
const jwt = require("jsonwebtoken");

let SALT_ROUND = 10;
let SECRET_KEY = "a125s458@d%^&f789"
let EXPIRE = "30m"



//Hashing to turn password (or any other piece of data) into a short string of letters and/or numbers using an encryption algorithm.
const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(Number(SALT_ROUND));
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

//hashCompare returns true or false
const hashCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

//firstName,lastName, email, role all this are payload sent as object
const createToken = ({ firstName, lastName, email }) => {
  let token = jwt.sign({ firstName, lastName, email}, SECRET_KEY, {
    expiresIn: EXPIRE,
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
  validate,
  roleAdmin
};
