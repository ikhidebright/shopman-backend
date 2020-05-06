module.exports = (app) => {
    const review = require("../controllers/reviews.controller.js");
  
    // Add a review
    app.post("/review", review.create);
  
    // Retrieve reviews for product
    app.get("/review/:productId", review.findOne);
};
  