module.exports = (app) => {
    const review = require("../controllers/reviews.controller.js");
  
    // Add a Product
    app.post("/review", review.create);
  
    // Retrieve one products
    app.get("/review/:productId", review.findOne);
};
  