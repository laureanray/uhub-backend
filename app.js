let express = require("express");
let app = express();

const bodyParser = require("body-parser");
const userRoutes = require("./components/User/user");

app.use(bodyParser.json());

app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
