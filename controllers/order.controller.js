const Order = require("../models/order.models.js");

// Add orders
exports.create = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Form cannot be empty",
    });
  }

  const product = new Order({
  product_id: req.body.product_id,
  total_price: req.body.total_price,
  shipping_address: req.body.shipping_address,
  order_quantity: req.body.order_quantity,
  city: req.body.city,
  state: req.body.state,
  customer_id: req.body.customer_id,
  ordered_at: req.body.ordered_at,
  });

  Order.create(product, (err, data) => {
    if (err)
    return res.status(500).send({
        message: err.message || "Some error occured while adding your products",
      });
    else return res.send(data);
  });
};

// Find all orders
exports.findAll = (req, res) => {
  Order.getAll((err, data) => {
    if (err)
    return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    else return res.send(data);
  });
};

// Find orders by a particular customer
exports.findOne = (req, res) => {
  Order.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found orders with customerId ${req.params.customerId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Error retrieving orders with customerId " + req.params.customerId,
          });
      }
    } else return res.send(data);
  });
};

// delete orders by orderId
exports.delete = (req, res) => {
  Order.remove(req.params.orderId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found order with id ${req.params.orderId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Could not delete order with id " + req.params.orderId,
          });
      }
    } else return res.send({ message: `order was deleted successfully!` });
  });
};