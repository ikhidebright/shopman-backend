module.exports = (app) => {
    const cart = require("../controllers/cart.controller.js");
  
    // Add an order
    app.post("/cart", cart.create);
  
    //Retrive all order
    app.get("/cart", cart.findAll);
  
    // Retrieve order by id
    app.get("/cart/:customerId", cart.findOne);
  
    // Delete order
    app.delete("/cart/:orderId", cart.delete);
  };
  