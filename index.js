const express = require("express");
const app = express();
const router = require("./src/route/api");
require("dotenv").config();

app.use(express.json());

app.use("/api/v1/product", router);

const port = process.env.PORT;
app.listen(port);
console.log("Restful API server started on: " + port);
