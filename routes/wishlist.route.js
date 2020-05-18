module.exports = (app) => {
  const wishlist = require("../controllers/wishlist.controller.js");

  // Add a wishlist
  app.post("/wishlist", wishlist.create);

  //Retrive all wishlist
  app.get("/wishlist", wishlist.findAll);

  // Retrieve one products
  app.get("/wishlist/:customerId", wishlist.findOne);

  // Delete wishlist
  app.delete("/wishlist/:Id", wishlist.delete);
};