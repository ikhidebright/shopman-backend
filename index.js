const express = require ('express')
const cors = require('cors')
const cookieparser  = require("cookie-parser")
const fileUpload = require('express-fileupload');
require("dotenv").config()

const bodyParser= require('body-parser')

const app = express()

//Parse requset of content type application/json
app.use(bodyParser.json());

//Parse content type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(cookieparser())
app.use(fileUpload({
    useTempFiles: true
}))

require("./routes/product.route.js")(app);
require("./routes/user.route.js")(app);
require("./routes/order.route.js")(app);
require("./routes/cart.route.js")(app);
require("./routes/review.route.js")(app);

const PORT = process.env.PORT || 6060
app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`)
})

