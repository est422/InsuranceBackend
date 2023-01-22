const mysql = require('mysql2');

const config = {
//    host: 'localhost',
    host: 'sql11.freesqldatabase.com',
    // user: 'root',
    user: 'sql11592485',
    // password: 'P@$sw0rd',
    // password: 'vVUNEWxAc4',
    password: 'U5CyZcIQgA',
    // database: 'insuranceappdb'
    database: 'sql11592485'
};

//Create connection
const db = mysql.createConnection(config);

//Connect
db.connect(function(err){
    if(err) throw err;
    console.log("DB Connected");
});   
    

module.exports = db;
// module.exports = config;
