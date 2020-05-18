const Customer = require("../models/user.models.js");
const { genSaltSync, hashSync, compareSync } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const db = require("../models/db.js");
const transporter = require('../config/Nodemailer.config.js')

exports.register = (req, res) => {
  // console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Form cannot be empty",
    });
  }

  let body = req.body

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
    else {
      let user = {
        id: data.result.insertId,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
      }
      let token = sign({ user: user }, process.env.SECRET, { expiresIn: 60 * 24 })
      return res
      .header("Authorization", token)
      .cookie("auth-token", token)
      .status(200)
      .send({
        success: true,
        token,
        data,
        user
      })
    }
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
            return res.status(200).send({
              result,
              success: true,
              message: "Address changed"
            })
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

exports.recover = (req, res) => {
  try {
    const { email } = req.body
    let sql = `SELECT * FROM customers where email = '${email}'`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        } 
        if (result.length < 1) {
            return res.json({
                success: false,
                message: `Sorry an Account with Email: ${email} doesn't exist`
            })
        } else {
            let secret = result[0].password;
            const token = sign({ id: result[0].id }, secret, { expiresIn: 3600 // 1 hour 
            });
            let url = `http://localhost:8080/set/${result[0].id }-${ token }`
            var mailOptions = {
                from: 'ikhidebright@gmail.com',
                to: email,
                subject: 'FORGOT PASSWORD',
                html: `Hello ${result[0].first_name} ${result[0].last_name}, 
                <br>
                <br>
                There was a request to reset your password
                <br>
                <br>
                Please click on the button below to get a new password
                <br>
                <br>
                <a href='${url}'><button>Reset Password</button></a>
                <br>
                <br>
                If you did not make this request, just ignore this email as nothing has changed.
                <br>
                <br>
                Best Regards,
                <br>
                The Shopman Team!`
              };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.status(402).json({
                        success: false,
                        message: "Failed to send e-mail reset Link"
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: `A password reset link has been sent to ${email}`
                    })
                }
              });
        }
    })
  } catch (e) {
      console.log(e)
  }
},

exports.checkResetPasswordToken = (req, res) => {
  try {
      const { id, token } = req.params
      let sql = `SELECT * from customers where id = ${id}`
      db.query(sql , (err, result) => {
          if (err) {
              console.log(err)
          } else {
              let secret = result[0].password
              verify(token, secret, function(err, decoded) {
                if (err) {
                    if (err.message === 'jwt expired') {
                        return res.status(401).json({
                            success: false,
                            message: "Sorry the token associated with this Link has Expired"
                        })
                    } else if (err.message === 'invalid signature') {
                        return res.status(401).json({
                            success: false,
                            message: "Sorry the token associated with this Link has an invalid signature"
                        })
                    }
                }
                if (decoded.id == id) {
                    return res.status(200).json({
                        success: true,
                        id: decoded.id,
                        decoded,
                        message: "token decoded"
                    })
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Sorry the token associated with this Link is Invalid"
                    })
                }
              });
          }
      })
  } catch (e) {
    return res.status(500).json({
        success: false,
        error: e,
        message: "Sorry an occured"
    })
  }
},

exports.ResetPasswordToken = (req, res) => {
try {
    const { id, token } = req.params
    const { password } = req.body
    let sql = `SELECT * from customers where id = ${id}`
    db.query(sql , (err, result) => {
        if (err) {
            console.log(err)
        } else {
            let secret = result[0].password
            verify(token, secret, function(err, decoded) {
              if (err) {
                  if (err.message === 'jwt expired') {
                      return res.status(202).json({
                          success: false,
                          message: "Sorry the token associated with this Link has Expired"
                      })
                  } else if (err.message === 'invalid signature') {
                      return res.status(202).json({
                          success: false,
                          message: "Sorry the token associated with this Link has an invalid signature"
                      })
                  }
              }
              if (decoded.id == id) {
                let salt = genSaltSync(10)
                let newPassword = hashSync(password, salt)
                  let sql = `UPDATE customers set password = '${newPassword}' where id = ${id}`
                  db.query(sql, (err, result) => {
                      if (err) {
                          console.log(err)
                      } else {
                          return res.status(200).json({
                              success: true,
                              result,
                              decoded,
                              message: "Password changed succesfully"
                          })
                      }
                  })
              } else {
                  return res.status(401).json({
                      success: false,
                      message: "Sorry the token associated with this Link is Invalid"
                  })
              }
            });
        }
    })
} catch (e) {
  return res.status(500).json({
      success: false,
      error: e,
      message: "Sorry an Error occured"
  })
}
},

exports.autoLogin = (req, res, next) => {
  return res.send("Good")
}