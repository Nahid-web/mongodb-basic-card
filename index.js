const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("../mongodb-basic-crud/routeHandler/todoHandler");
const userHandler = require("../mongodb-basic-crud/routeHandler/userHandler");

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());

// Set the strictQuery option
mongoose.set("strictQuery", false);

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

//application route
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(3000, () => {
  console.log("app listening at port 3000");
});
