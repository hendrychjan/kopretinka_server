// Read environment variables from .env file
import * as dotenv from "dotenv";

module.exports = () => {
  // Load the contents of the .env file into process.env according to the type of the environment
  dotenv.config({ path: `${__dirname}/../../.env` });
}