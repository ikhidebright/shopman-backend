const db = require("./db.js");

// Constructor
const Cart = function (cart) {
  this.cart = cart.cart;
  this.customer_id = cart.customer_id;
};

// Add Cart
Cart.create = (newCart, result) => {
  let sql = `INSERT INTO cart SET ?`
  db.query(sql, newCart, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { result: res });
    return;
  });
};

// Find Cart by a particular customer
Cart.findById = (customerId, result) => {
  db.query(`SELECT * FROM cart WHERE customer_id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error:  ", err);
      result(err, null);
      return;
}
    if (res.length) {
      console.log("Found Cart: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
    return;
  });
};

// Find all Cart
Cart.getAll = (result) => {
  let sql = `SELECT * FROM cart`
  db.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

// delete Cart by customerId
Cart.remove = (customerId, result) => {
  let sql = `DELETE FROM cart WHERE customer_id =   ${customerId}`
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
    console.log("Deleted cart: ");
    result(null, res);
    return;
  });
};

module.exports = Cart