const mongoose = require("mongoose")
require("dotenv").config()

const connectionUri = process.env.MONGODB

const makeDbConnection = async () => {
    await mongoose
    .connect(connectionUri)
    .then(() => {console.log("connected to DB")})
    .catch((error) => {console.log("error occured while connecting to DB."), error})
}

module.exports = {makeDbConnection}