const db = require("./db.js");

// Constructor
const Wishlist = function (wishlist) {
  this.name = wishlist.name;
  this.price = wishlist.price;
  this.description = wishlist.description;
  this.thumb = wishlist.thumb;
  this.product_id = wishlist.product_id;
  this.customer_id = wishlist.customer_id;
};

// Insert
Wishlist.create = (newWishlist, result) => {
  let sql = `INSERT INTO wishlist SET ?`
  db.query(sql, newWishlist, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { result: res });
    return;
  });
};

Wishlist.findById = (customerId, result) => {
  db.query(`SELECT * FROM wishlist WHERE customer_id = '${customerId}'`, (err, res) => {
    if (err) {
      console.log("error:  ", err);
      result(err, null);
      return;
}
    if (res.length) {
      console.log("Found wishlist: ", res);
      result(null, res);
      return;
    }
    result({ kind: "not_found" }, null);
    return;
  });
};

Wishlist.getAll = (result) => {
  let sql = `SELECT * FROM wishlist`
  db.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Wishlist.remove = (Id, result) => {
  let sql = `DELETE FROM wishlist WHERE id = ${Id}`
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
    console.log("Deleted wishlist: ");
    result(null, res);
    return;
  });
};

module.exports = Wishlist