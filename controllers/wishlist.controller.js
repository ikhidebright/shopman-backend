const Wishlist = require("../models/wishlist.model.js");

exports.create = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Form cannot be empty",
    });
  }
  const wishlist = new Wishlist({
    name: req.body.name,
    price: req.body.price,
    thumb: req.body.thumb,
    description: req.body.description,
    product_id: req.body.product_id,
    customer_id: req.body.customer_id
  });
  Wishlist.create(wishlist, (err, data) => {
    if (err)
    return res.status(201).send({
        message: err.message || "Some error occured while adding your wishlist",
        errorcode: err.errno
      });
    else return res.send(data);
  });
};

exports.findAll = (req, res) => {
  Wishlist.getAll((err, data) => {
    if (err)
    return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving wishlist.",
      });
    else return res.send(data);
  });
};

exports.findOne = (req, res) => {
  Wishlist.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found wishlist with id ${req.params.customerId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Error retrieving wishlist with id " + req.params.customerId,
          });
      }
    } else return res.send(data);
  });
};

exports.delete = (req, res) => {
  Wishlist.remove(req.params.Id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found wishlist with id ${req.params.Id}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Could not delete wishlist with id " + req.params.Id,
          });
      }
    } else return res.send({ 
      success: true,
      message: `wishlist was deleted successfully!` 
    });
  });
};