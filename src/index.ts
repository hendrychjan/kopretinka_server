// Setup the express server
const app = require("express")();
const http = require("http").Server(app);
const port = process.env.PORT || 3000;

// Setup the API
require("./startup/env")();
require("./startup/middleware")(app);
require("./startup/router")(app);

// Start the http server
const server = http.listen(port, "192.168.1.30", () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`...Server listening on port ${port}`);
  }
});

module.exports = server;