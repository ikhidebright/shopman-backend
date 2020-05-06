const Payment = require("../models/payments.models.js");

// Add orders
exports.create = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Form cannot be empty",
    });
  }

  const payment = new Payment({
  order_id: req.body.order_id,
  payment_amount: req.body.payment_amount,
  payment_status: req.body.payment_status,
  payment_date: req.body.payment_date,
  payment_type: req.body.payment_type,
  card_holder_name: req.body.card_holder_name,
  card_type: req.body.card_type,
  });

  Payment.create(payment, (err, data) => {
    if (err)
    return res.status(500).send({
        message: err.message || "Some error occured while adding payments",
      });
    else return res.send(data);
  });
};

// Find all Payments
exports.findAll = (req, res) => {
  Payment.getAll((err, data) => {
    if (err)
    return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Payments.",
      });
    else return res.send(data);
  });
};

// Find orders by a particular order
exports.findOne = (req, res) => {
  Payment.findById(req.params.orderId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found Payment with orderId ${req.params.orderId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Error retrieving Payment with orderId " + req.params.orderId,
          });
      }
    } else return res.send(data);
  });
};

// delete Payments by paymentId
exports.delete = (req, res) => {
  Payment.remove(req.params.orderId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found Payment with orderId ${req.params.orderId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Could not delete Payment with orderId " + req.params.orderId,
          });
      }
    } else return res.send({ message: `Payment was deleted successfully!` });
  });
};