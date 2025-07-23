const express = require("express");
const products = require("../data/products.json");
const productsRouter = express.Router();

productsRouter.route("/").get((req, res) => {
  res.render("products", { products });
});

productsRouter.route("/:id").get((req, res) => {
  const id = req.params.id;
  res.render("product", {
    product: products[id],
  });
});

module.exports = productsRouter;
