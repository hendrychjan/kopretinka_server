// Setup all the endpoints for the API
module.exports = (app: any) => {

  const ping = require("../routes/ping");
  const modules = require("../routes/modules");

  app.use("/ping", ping);
  app.use("/modules", modules);
};