const db = require("./db.js");

// Constructor
const Order = function (order) {
  this.product_id = order.product_id;
  this.total_price = order.total_price;
  this.shipping_address = order.shipping_address
  this.order_quantity = order.order_quantity;
  this.city = order.city;
  this.state = order.state;
  this.customer_id = order.customer_id;
  this.ordered_at = order.ordered_at;
};

// Add orders
Order.create = (newOrders, result) => {
  let sql = `INSERT INTO orders SET ?`
  db.query(sql, newOrders, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { result: res });
    return;
  });
};

// Find orders by a particular customer
Order.findById = (customerId, result) => {
  db.query(`SELECT * FROM orders WHERE customer_id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error:  ", err);
      result(err, null);
      return;
}
    if (res.length) {
      console.log("Found Product: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
    return;
  });
};

// Find all orders
Order.getAll = (result) => {
  let sql = `SELECT * FROM orders`
  db.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

// delete orders by orderId
Order.remove = (orderId, result) => {
  let sql = `DELETE FROM orders WHERE order_id =   ${orderId}`
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
    console.log("Deleted order: ");
    result(null, res);
    return;
  });
};

module.exports = Order