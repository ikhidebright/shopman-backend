const Customer = require("../models/user.models.js");
const { genSaltSync, hashSync, compareSync } = require("bcryptjs")
const { sign } = require("jsonwebtoken")

exports.register = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    res.status(400).send({
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
    else return res.send(data);
  });
      } else {
        return res
          .status(500)
          .send({
            message: "Some error occured while registering",
          });
      }
    } else return res
    .status(500)
    .send({
      message: "This email is already registered",
    });
  });
};

exports.findAll = (req, res) => {
    Customer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    else res.send(data);
  });
};

exports.login = (req, res) => {

    const customer = new Customer({
        email: req.body.email
      });

    Customer.findByEmail(req.body.email, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .send({
            message: `Not found customer with email ${customer.email}.`,
          });
      } else {
        res
          .status(500)
          .send({
            message: "Error retrieving customer with email " + customer.email,
          });
      }
    } else {
        let token = sign({ user: data[0] }, process.env.SECRET, { expiresIn: 60 * 24 })
        console.log(token)
        res
        .header("auth-token", token)
        .send(data);
    }
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  Customer.updateById(
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
    Customer.remove(req.params.productId, (err, data) => {
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