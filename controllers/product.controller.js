const Product = require("../models/product.model.js");
const cloudinary = require("../config/cloudinary.config.js");
const db = require("../models/db");

exports.create = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Form cannot be empty",
    });
  }

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    thumb: req.body.image,
    description: req.body.description,
    category: req.body.category
  });

  Product.create(product, (err, data) => {
    if (err)
    return res.status(500).send({
        message: err.message || "Some error occured while adding your products",
      });
    else return res.send(data);
  });
};

exports.findAll = (req, res) => {
  Product.getAll((err, data) => {
    if (err)
    return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    else return res.send(data);
  });
};

exports.findOne = (req, res) => {
  Product.findById(req.params.productId, (err, data) => {
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
            message: "Error retrieving product with id " + req.params.productId,
          });
      }
    } else return res.send(data);
  });
};

exports.category = (req, res) => {
  Product.findByCategory(req.params.category, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found product with id ${req.params.category}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Error retrieving product with id " + req.params.category,
          });
      }
    } else return res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  Product.updateById(
    req.params.productId,
    new Product(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res
            .status(404)
            .send({
              message: `Not found Product with id ${req.params.productId}.`,
            });
          return;
        } else {
          res
            .status(500)
            .send({
              message: "Error updating product with id " + req.params.productId,
            });
          return;
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Product.remove(req.params.productId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({
            message: `Not found Product with id ${req.params.productId}.`,
          });
      } else {
        res
          .status(500)
          .send({
            message: "Could not delete product with id " + req.params.productId,
          });
      }
    } else res.send({ message: `product was deleted successfully!` });
  });
};

// add image thumb
exports.createthumb = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  const file = req.files.image;
  cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Upload error, try again"
      })
    } else {
        const product = new Product({
          thumb: result.url
      });
      Product.createthumb (
        req.params.productId,
        product,
        (err, data) => {
          if (err) {
            console.log(err)
            if (err.kind === "not_found") {
              res
                .status(404)
                .send({
                  message: `Not found Product with id ${req.params.productId}.`,
                });
              return;
            } else {
              res
                .status(500)
                .send({
                  message: "Error updating product with id " + req.params.productId,
                });
              return;
            }
          } else res.send(data);
        }
      );  
    }
})  
};

// search products
exports.searchproducts = async (req, res, next) => {
  try {
  let sql = `SELECT * FROM products WHERE name like '%${req.params.search}%' || category like '%${req.params.search}%'`;
  db.query(sql, (err, results) => {
      if(err) {
     return res.status(500).json({message: "Sorry an error occured... try again"});
      }
      return res.status(200).json({result: results})
  })
} catch (error) {
  console.log(error)
 }
}