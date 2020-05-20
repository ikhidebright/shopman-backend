const verifyToken = require("../middlewares/verifyAuth")

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
    
    // Auth customer
    app.get("/authuser/", verifyToken, user.autoLogin);

    
    // updatePassword
    app.post("/updatepassword/:customerId", user.updatePassword);
    
    // updateAddress
    app.put("/updateaddress/:customerId", user.updateAddress);

    // recover password
    app.post('/recover', user.recover)

    // check pass token
    app.post('/checklostpasstoken/:id-:token', user.checkResetPasswordToken)

    // reset pass token
    app.post('/resetpasstoken/:id-:token', user.ResetPasswordToken)
  };