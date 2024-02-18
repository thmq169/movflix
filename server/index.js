const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./src/routes/index");
dotenv.config();

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/", indexRouter);

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    server.listen(port);
    console.log(`Listening on port http://localhost:${port}`);
    console.log(`mongodb connected at ${process.env.MONGODB_URL}`);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
