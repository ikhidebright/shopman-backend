const db = require("./db.js");

// Constructor
const Payment = function (payment) {
  this.order_id = payment.order_id;
  this.payment_amount = payment.payment_amount;
  this.payment_status = payment.payment_status;
  this.payment_date = payment.payment_date;
  this.payment_type = payment.payment_type;
  this.card_holder_name = payment.card_holder_name;
  this.card_type = payment.card_type;
};

// Add orders
Payment.create = (newPayment, result) => {
  let sql = `INSERT INTO payment SET ?`
  db.query(sql, newPayment, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { result: res });
    return;
  });
};

// Find orders for a particular product
Payment.findById = (orderId, result) => {
  db.query(`SELECT * FROM payment WHERE product_id = ${orderId}`, (err, res) => {
    if (err) {
      console.log("error:  ", err);
      result(err, null);
      return;
}
    if (res.length) {
      console.log("Found payment: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
    return;
  });
};

// Find all orders
Payment.getAll = (result) => {
  let sql = `SELECT * FROM payment`
  db.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

// delete orders by paymentId
Payment.remove = (orderId, result) => {
  let sql = `DELETE FROM payment WHERE order_id = ${paymentId}`
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
    console.log("Deleted payment: ");
    result(null, res);
    return;
  });
};

module.exports = Payment