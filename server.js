const express = require("express");
require("dotenv").config();
const logger = require("./config/logger");
const connectDB = require("./db/db.connection");
const routes = require("./routes");
const MESSAGE = require("./utils/message");
const cors = require("cors");
const { default: helmet } = require("helmet");
const morgan = require("./config/morgan");
const apiResponse = require("./utils/api.response");
var bodyParser = require('body-parser')

// const seeder = require('./seeder')

const app = express();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.options("*", cors());
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use("/api/v1", routes);

app.use((req, res, next) => {
  return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("Route") });
});

// database connection and port listening
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`---error--`, error);
  });
