const Customer = require("../models/user.models.js");
const { genSaltSync, hashSync, compareSync } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const db = require("../models/db.js");

exports.register = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Form cannot be empty",
    });
  }

  const customer = new Customer({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    date_joined: req.body.date_joined,
    address: req.body.address,
    email: req.body.email,
    state: req.body.state,
    password: req.body.password,
  });

  let salt = genSaltSync(10)
  customer.password = hashSync(customer.password, salt)

  Customer.findByEmail(customer.email, (err, data) => {
    if (err) {
      if (err.kind === "not_found") { 
        Customer.create(customer, (err, data) => {
    if (err)
      return res.status(500).send({
        message: err.message || "Some error occured while registering",
      });
    else return res
    .status(200)
    .send({
      success: true,
      data
    });
  });
      } else {
        return res
          .status(500)
          .send({
            message: "Some error occured while registering",
          });
      }
    } else return res
    .status(201)
    .send({
      email: true,
      message: "This email is already registered",
    });
  });
};

exports.findAll = (req, res) => {
    Customer.getAll((err, data) => {
    if (err)
    return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users.",
      });
    else return res.send(data);
  });
};

exports.login = (req, res) => {

  if (!req.body) {
    return res
          .status(201)
          .send({
            message: `email cannot be empty`,
          });
  } else {
    const customer = new Customer({
        email: req.body.email
      });

    Customer.findByEmail(req.body.email, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(201)
          .send({
            message: `Not found customer with email ${customer.email}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Error retrieving customer with email " + customer.email,
          });
      }
    } else {
        let match = compareSync(req.body.password, data.password)
        if (match) {
        let token = sign({ user: data }, process.env.SECRET, { expiresIn: 60 * 24 })
        return res
        .header("Authorization", token)
        .cookie("auth-token", token)
        .send({
          success: true,
          data,
          token
        });
        } else {
          return res
          .send({
           message: "Invalid email or password",
        });
        }
    }
  });
  }
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  Customer.updateById(
    req.params.customerId,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res
            .status(404)
            .send({
              message: `Not found customer with id ${req.params.customerId}.`,
            });
          return;
        } else {
          return res
            .status(500)
            .send({
              message: "Error updating customer with id " + req.params.customerId,
            });
          return;
        }
      } else return res.send(data);
    }
  );
};

exports.updatePassword = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }
  let checkuser = `SELECT * FROM customers WHERE id = '${req.params.customerId}'`
  db.query(checkuser, (err, result) => {
    if (err) {
      console.log(err)
    }
    if (result.length > 0) {
      let match = compareSync(req.body.password, result[0].password)
      if (match) {
        let salt = genSaltSync(10)
        let password = hashSync(req.body.newpassword, salt)
        let updatepassword = `UPDATE customers SET password='${password}' WHERE id = '${req.params.customerId}'`
        db.query(updatepassword, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            return res.status(200).send({
              result,
              message: "Password changed"
            })
          }
        })
      } else {
        return res.status(201).send({
          message: "Incorrect Current Password"
        })
      }
    }
  })
};

exports.updateAddress = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }
        let updatepassword = `UPDATE customers SET address='${req.body.address}' WHERE id = '${req.params.customerId}'`
        db.query(updatepassword, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            return res.status(200).send(result)
          }
      })
};

exports.cart = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }
        let updatepassword = `INSERT INTO cart SET item='${req.body.cart}' WHERE customer_id = '${req.params.customerId}'`
        db.query(updatepassword, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            return res.status(200).send(result)
          }
      })
};

exports.delete = (req, res) => {
    Customer.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({
            message: `Not found customer with id ${req.params.customerId}.`,
          });
      } else {
        return res
          .status(500)
          .send({
            message: "Could not delete customer with id " + req.params.customerId,
          });
      }
    } else return res.send({ message: `customer was deleted successfully!` });
  });
};

exports.autoLogin = (req, res, next) => {
  return res.send("Good")
}