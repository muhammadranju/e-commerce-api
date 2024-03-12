const mongoose = require("mongoose");
const { DATABASE_NAME, DATABASE_QUERY } = require("../constants");

// MongoDB URI for production environment
const MONGODB_URI = process.env.MONGODB_URI; // REPLACE WITH YOUR OWN MONGODB URI

// MongoDB URI for local development environment
const MONGODB_URI_LOCAL = process.env.MONGODB_URI_LOCAL; // REPLACE WITH YOUR LOCAL MONGODB URI

// Function to establish connection with MongoDB
async function connectDB() {
  try {
    // Connect to the local MongoDB instance for development/testing
    const connectInstance = await mongoose.connect(
      `${MONGODB_URI_LOCAL}/${DATABASE_NAME}`
    );

    // Connect to the production MongoDB instance for deployment
    // const connectInstance = await mongoose.connect(
    //   `${MONGODB_URI}/${DATABASE_NAME}${DATABASE_QUERY}`
    // );

    // Log successful connection to MongoDB
    console.log(
      `MongoDB connected!! DB HOST: ${connectInstance.connection.host}`
    );
  } catch (error) {
    // Log error and exit the process if connection fails
    console.log("MONGODB CONNECTION FIELD: ", error);
    process.exit(1);
  }
}

module.exports = connectDB;
