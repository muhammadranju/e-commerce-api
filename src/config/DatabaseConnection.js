const mongoose = require("mongoose");
const { DATABASE_NAME, DATABASE_QUERY } = require("../constants");

const MONGODB_URI = process.env.MONGODB_URI; // REPLACE WITH YOUR OWN MONGODB URI
const MONGODB_URI_LOCAL = process.env.MONGODB_URI_LOCAL; // REPLACE WITH YOUR LOCAL MONGODB URI

async function connectDB() {
  try {
    const connectInstance = await mongoose.connect(
      `${MONGODB_URI_LOCAL}/${DATABASE_NAME}`
    );

    // const connectInstance = await mongoose.connect(
    //   `${MONGODB_URI}/${DATABASE_NAME}${DATABASE_QUERY}`
    // );
    console.log(
      `MongoDB connected!! DB HOST: ${connectInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FIELD: ", error);
    process.exit(1);
  }
}

module.exports = connectDB;
