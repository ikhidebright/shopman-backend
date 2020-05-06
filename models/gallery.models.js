const db = require("./db.js");

const Gallery = function (gallery) {
    this.image = gallery.image;
    this.product_id = gallery.product_id;
  };

// Add images to product gallery
Gallery.create = (newGallery, result) => {
    let sql = `INSERT INTO gallery SET ?`
    db.query(sql, newGallery, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { result: res });
    });
  };
  

  Gallery.remove = (productId, result) => {
    let sql = `DELETE FROM gallery WHERE product_id =   ${productId}`
    db.query(sql, (err, res) => {
      if (err) {
        console.log("error:  ", err);
        result(err, null);
        return;
      }
  
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Deleted Product gallery: ");
      result(null, res);
    });
};


module.exports =  Gallery