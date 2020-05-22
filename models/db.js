const mysql = require("mysql");
const dbConfig = require("../config/db.congfig.js");

const connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.user,
    password: dbConfig.PASSWORD,
    database: dbConfig.db
});

connection.getConnection(function(err, connection) {
    if (err) {
        console.log(err)
    }
    if (connection) {
        console.log('Database connected!!')
    }
})

module.exports = connection;
