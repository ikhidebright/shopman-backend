const { verify } = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization") || req.cookies.sp_tk
    if(!token) {
        return res.status(401).send("Unauthorized")
    } else {
        verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                console.log(err)
            } else {
                next()
            }
          });
    }
}

module.exports = verifyToken