// Setup all the endpoints for the API
module.exports = (app: any) => {

  const ping = require("../routes/ping");

  app.use("/ping", ping);
};