module.exports = (app) => {
    const order = require("../controllers/order.controller.js");
  
    // Add an order
    app.post("/order", order.create);
  
    //Retrive all order
    app.get("/order", order.findAll);
  
    // Retrieve order by id
    app.get("/order/:customerId", order.findOne);
  
    // Delete order
    app.delete("/order/:orderId", order.delete);
  };
  