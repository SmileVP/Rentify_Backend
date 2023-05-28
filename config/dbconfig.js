const dbName=process.env.DB_NAME;
require('dotenv').config()

const dbUrl=`${process.env.DB_URL}/${dbName}`

module.exports={dbName,dbUrl}

