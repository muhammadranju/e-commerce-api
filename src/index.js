require("dotenv").config();
const app = require("./app");
const http = require("http");
const databaseConnection = require("./db/databaseConnection");
const config = require("./config/config");
const ApiError = require("./utils/ApiError");

const PORT = config.PORT || 3030;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to the database
    await databaseConnection();

    // Start the HTTP server
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    // Log a more detailed error message
    console.error("Error starting the server:");
    console.error(error.message);
    console.error(error);
    throw new ApiError(500, "Error starting server");
  }
};

startServer();
