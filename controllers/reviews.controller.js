const Reviews = require("../models/reviews.models.js");

exports.create = (req, res) => {
    // console.log(req.body);
    if (!req.body) {
      res.status(400).send({
        message: "Form cannot be empty",
      });
    }
  
    const reviews = new Reviews({
      name: req.body.name,
      message: req.body.message,
      product_id: req.body.product_id
    });
  
    Reviews.create(reviews, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occured while adding a review",
        });
      else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Reviews.findById(req.params.productId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
         return res
            .status(404)
            .send({
              message: `Not found product with id ${req.params.productId}.`,
            });
        } else {
            return res
            .status(500)
            .send({
              message: "Error retrieving reviews with id " + req.params.productId,
            });
        }
      } else return res.send(data);
    });
};