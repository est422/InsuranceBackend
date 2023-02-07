const mysql = require('mysql2');

const config = {
//    host: 'localhost',
    // host: 'sql11.freesqldatabase.com',
    host: 'sql12.freemysqlhosting.net',
    // user: 'root',
    // user: 'sql11592485',
    user: 'sql12596276',
    // password: 'P@$sw0rd',
    // password: 'vVUNEWxAc4',
    // password: 'U5CyZcIQgA',
    password: 'E1S3z2hRHH',
    // database: 'insuranceappdb'
    // database: 'sql11592485'
    database: 'sql12596276'
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
