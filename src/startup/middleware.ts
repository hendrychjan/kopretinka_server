// Hook up all the middleware that is necessary for every environment.

module.exports = (app: any) => {
  // ALL
  const express = require("express");
  const cors = require("cors");

  const CORS_CONFIG = {
    origin: "*",
  };

  app.use(cors(CORS_CONFIG));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // PRODUCTION
  if (process.env.NODE_ENV === "production") {
    const helmet = require("helmet");
    const compression = require("compression");
    app.use(helmet());
    app.use(compression());
  }

  // PRODUCTION, DEVELOPMENT
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "development"
  ) {
    const morgan = require("morgan");
    app.use(morgan(process.env.MORGAN_FORMAT));
  }
};