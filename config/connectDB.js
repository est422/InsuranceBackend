require('dotenv').config();
const mysql = require('mysql2');

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const db = mysql.createConnection(config);

db.connect(function(err){
    if (err) throw err;
    console.log("DB Connected");
});   

module.exports = db;

// const mysql = require('mysql2');

// const config = {
// //    host: 'localhost',
//     // host: 'sql11.freesqldatabase.com',
//     host: 'sql7.freemysqlhosting.net',
//     // user: 'root',
//     // user: 'sql11592485',
//     user: 'sql7604608',
//     // password: 'P@$sw0rd',
//     // password: 'vVUNEWxAc4',
//     // password: 'U5CyZcIQgA',
//     password: 'BqkmN6zj3a',
//     // database: 'insuranceappdb'
//     // database: 'sql11592485'
//     database: 'sql7604608'
// };

// //Create connection
// const db = mysql.createConnection(config);

// //Connect
// db.connect(function(err){
//     if(err) throw err;
//     console.log("DB Connected");
// });   
    

// module.exports = db;
// // module.exports = config;
