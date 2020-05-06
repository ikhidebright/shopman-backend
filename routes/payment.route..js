module.exports = (app) => {
    const payment = require("../controllers/payments.controller.js");
  
    // Add an order
    app.post("/payment", payment.create);
  
    //Retrive all order
    app.get("/payment", payment.findAll);
  
    // Retrieve order by id
    app.get("/payment/:customerId", payment.findOne);
  
    // Delete order
    app.delete("/payment/:paymentId", payment.delete);
  };
  