const Gallery = require("../models/gallery.models.js");
const cloudinary = require("../config/cloudinary.config.js");

  exports.create = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Form cannot be empty",
      });
    }
      const file = req.files.image;
      cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Upload error, try again"
          })
        } else {
            const gallery = new Gallery({
                image: result.url,
                product_id: req.body.product_id
            });
            Gallery.create(gallery, (err, data) => {
              if (err)
                res.status(500).send({
                  message: err.message || "Some error occured while adding your images",
                });
              else res.send(data);
            }); 
        }
    })
};

exports.delete = (req, res) => {
  Gallery.remove(req.params.productId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found Product gallery with id ${req.params.productId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Could not delete product gallery with id " + req.params.productId,
          });
      }
    } else return res.send({ message: `product gallery was deleted successfully!` });
  });
};