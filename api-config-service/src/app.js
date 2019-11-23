const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotEnv = require("dotenv");

dotEnv.config();

const app = express();
app.use(cors());

const mongoUrl = `mongodb://${process.env.MONGO_URL || "localhost"}:${process
  .env.MONGO_PORT || "27017"}/configs`;

mongoose.set("debug", process.env.NODE_ENV !== "production");

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log(
    `MongoDB connected on mongodb://${process.env.MONGO_URL ||
      "localhost"}:${process.env.MONGO_PORT || "27017"}`
  );
});

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);

  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("./routes/routes"));

const port = process.env.SERVE_PORT;
if (!port) {
  console.log("PORT undefined");
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

module.exports = app;
