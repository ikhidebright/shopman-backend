const db = require("./db.js");

// Constructor
const Review = function (review) {
  this.message = review.message;
  this.name = review.name;
  this.product_id = review.product_id;
};

// Insert
Review.create = (newProduct, result) => {
  let sql = `INSERT INTO reviews SET ?`
  db.query(sql, newProduct, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { result: res });
  });
};

Review.findById = (productId, result) => {
  db.query(`SELECT * FROM reviews WHERE product_id = ${productId}`, (err, res) => {
    if (err) {
      console.log("error:  ", err);
      result(err, null);
      return;
}
    if (res.length) {
      console.log("Found review for Product: ", res[0]);
      result(null, res[0]);
      return
    }
    result({ kind: "not_found" }, null);
    return
  });
};

module.exports = Review