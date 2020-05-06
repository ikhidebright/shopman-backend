module.exports = (app) => {
    const user = require("../controllers/user.controller.js");
    // Add a customer
    app.post("/user", user.register);
  
    //Retrive all customer
    app.get("/user", user.findAll);
  
    // Retrieve one customer
    app.post("/login", user.login);
  
    // Edit customer
    app.put("/user/:customerId", user.update);
  
    // Delete customer
    app.delete("/user/:customerId", user.delete);
  };