const nodemailer = require("nodemailer");

 // create reusable transporter object using the default SMTP transport
 let transporter = nodemailer.createTransport({
  service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME, // generated ethereal user
      pass: process.env.GMAIL_PASSWORD  // generated ethereal password
    }
  });

  module.exports = transporter