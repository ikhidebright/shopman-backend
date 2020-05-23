const express = require ('express')
const cors = require('cors')
const cookieparser  = require("cookie-parser")
const fileUpload = require('express-fileupload');
require("dotenv").config()

const bodyParser= require('body-parser')

const app = express()

//Parse requset of content type application/json
app.use(bodyParser.json());

const corsOptions = {
    origin: 'https://shopman.netlify.app/',
    methods: ["POST", "PATCH", "PUT"],
    // credentials: true,
    maxAge: 3600
};


app.use(function(req, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "https://shopman.netlify.app/");
    response.setHeader("Access-Control-Allow-Credentials", "true");
     response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
     response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
     next();
    });
    
app.use(cors(corsOptions))
//Parse content type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieparser())
app.use(fileUpload({
    useTempFiles: true
}))

require("./routes/product.route.js")(app);
require("./routes/user.route.js")(app);
require("./routes/order.route.js")(app);
require("./routes/cart.route.js")(app);
require("./routes/review.route.js")(app);
require("./routes/wishlist.route.js")(app);

const PORT = process.env.PORT || 6060
app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`)
})

