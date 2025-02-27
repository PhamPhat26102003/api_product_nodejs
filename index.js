const express = require("express");
const app = express();
const router = require("./src/route/api");
const { connectToDatabase } = require("./src/db/connect");
require("dotenv").config();

app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/product", router);

const port = process.env.PORT || 8089;

connectToDatabase()
  .then(() => {
    app.listen(port, () =>
      console.log("Restful API server started on: " + port),
    );
  })
  .catch((err) => {
    console.log("Error with connect to database: ", err);
    process.exit(0);
  });
