require("dotenv").config();
const app = require("./app");
const http = require("http");
const DatabaseConnection = require("./config/DatabaseConnection");

const PORT = process.env.PORT || 3030;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to the database
    await DatabaseConnection();

    // Start the HTTP server
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    // Log a more detailed error message
    console.error("Error starting the server:");
    console.error(error.message);
    console.error(error);
  }
};

startServer();
