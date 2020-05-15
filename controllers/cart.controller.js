const Cart = require("../models/cart.models.js");

// Add orders
exports.create = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Form cannot be empty",
    });
  }

  const cart = new Cart({
  product_id: req.body.product_id,
  total_price: req.body.total_price,
  });

  Cart.create(cart, (err, data) => {
    if (err)
    return res.status(500).send({
        message: err.message || "Some error occured while adding your products",
      });
    else return res.send(data);
  });
};

// Find all orders
exports.findAll = (req, res) => {
  Cart.getAll((err, data) => {
    if (err)
    return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    else return res.send(data);
  });
};

// Find Cart by a particular customer
exports.findOne = (req, res) => {
  Cart.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found Cart with customerId ${req.params.customerId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Error retrieving Cart with customerId " + req.params.customerId,
          });
      }
    } else return res.send(data);
  });
};

// delete orders by orderId
exports.delete = (req, res) => {
  Cart.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found cart with id ${req.params.customerId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Could not delete cart with id " + req.params.customerId,
          });
      }
    } else return res.send({ message: `cart was deleted successfully!` });
  });
};