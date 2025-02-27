const express = require("express");
const app = express();
const router = require("./src/route/api");
const sequelize = require("./src/db/connect");
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/product", router);

const port = process.env.PORT || 8089;

sequelize
  .sync()
  .then(() => {
    app.listen(port, () =>
      console.log("Restful API server started on: " + port),
    );
  })
  .catch((err) => {
    console.log("Error with connect to database: ", err);
    process.exit(0);
  });
