const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");

const productsRouter = require("./src/router/productsRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "/public")));

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.render("index", { username: "JJJ", customers: ["AAA", "BBBB"] });
});

app.listen(PORT, () => {
  debug("listening on port " + chalk.red(" : " + PORT));
});
