const db = require("./db.js");

// Constructor
const Customer = function (customer) {
  this.first_name = customer.first_name;
  this.last_name = customer.last_name;
  this.phone = customer.phone;
  this.date_joined = customer.date_joined
  this.address = customer.address;
  this.email = customer.email;
  this.state = customer.state;
  this.password = customer.password;
};

// Insert
Customer.create = (newCustomer, result) => {
  let sql = `INSERT INTO customers SET ?`
  db.query(sql, newCustomer, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { result: res });
  });
};

Customer.findByEmail = (customerEmail, result) => {
    db.query(`SELECT * FROM customers WHERE email = '${customerEmail}'`, (err, res) => {
      if (err) {
        console.log("error:  ", err);
        result(err, null);
        return;
  }
      if (res.length) {
        console.log("Found customer: ", res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
      return
    });
};

Customer.findById = (customerId, result) => {
  db.query(`SELECT * FROM customers WHERE id = '${customerId}'`, (err, res) => {
    if (err) {
      console.log("error:  ", err);
      result(err, null);
      return;
}
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
    return
  });
};

Customer.getAll = (result) => {
  let sql = `SELECT * FROM customers`
  db.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Customer.updateById = (customerId, customer, result) => {
  let sql = `UPDATE customers SET first_name=?, last_name=?, email=?, phone=?, address=?, state=?, password=? WHERE id =? `
  db.query(sql, [customer.first_name, customer.last_name, customer.email, customer.phone, customer.address, customer.state, customer.password, customerId],
    (err, res) => {
      if (err) {
        console.log("error:  ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Updated customer: ");
      result(null, { customer_id: customerId, ...customer });
    }
  );
};

Customer.updatePassword = (customerId, password, result) => {
  let sql = `UPDATE customers SET password=? WHERE id =? `
  db.query(sql, [password, customerId],
    (err, res) => {
      if (err) {
        console.log("error:  ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Updated customer: ");
      result(null, { customer_id: customerId, ...password });
    }
  );
};

Customer.remove = (customerId, result) => {
  let sql = `DELETE FROM customers WHERE id = '${customerId}'`
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
    console.log("Deleted customer: ");
    result(null, res);
  });
};

module.exports = Customer