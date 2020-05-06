module.exports = (app) => {
    const user = require("../controllers/user.controller.js");
    // Register
    app.post("/user", user.register);
  
    //Retrive all customer
    app.get("/user", user.findAll);
  
    // Login
    app.post("/login", user.login);
  
    // Edit customer
    app.put("/user/:customerId", user.update);
  
    // Delete customer
    app.delete("/user/:customerId", user.delete);
  };