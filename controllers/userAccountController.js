const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('../config/connectDB');
const { TOKEN_SECRET } = require('../config/default.json');

//Get all user accounts
module.exports.getAllUserAccounts = async (req, res) => {

    const sql = 'SELECT * FROM useraccount';
    db.query(sql, (err, result) => {
        if(err) return res.status(400).json({ error: err.sqlMessage });
        return res.status(200).json(result);

    });

};

//Login user
module.exports.loginUser = async (req, res) => {

    const {phone, password} = req.body;

    //Check if phone exists
    const sql = 'SELECT * FROM useraccount WHERE Phone = ?';
    db.query(sql, phone, async (err, rows) => {

        if(err || !rows.length) return res.status(400).json({ error: "User account does not exist" });
        // return res.status(200).json({});

        // if(!rows.length) return res.status(400).json({ error: "User account does not exist" });

        // Check password
        const validPassword = await bcrypt.compare(password, rows[0].Password);
        if(!validPassword) return res.status(400).json({ error: "Password is not valid" });
        
        // Create token
        const token = await jwt.sign({ Id: rows[0].id}, TOKEN_SECRET);
        // res.header('Authorization', token);
        // req.session.user = rows;

        return res.status(200).json(token);

    });

};

//Create user account
module.exports.createUserAccount = async (req, res, next) => {

    const {firstName, lastName, email, password, phone, enteredPrice} = req.body;
    //Check if phone exists
    const sql = 'SELECT * FROM useraccount WHERE Phone = ? ';
    db.query(sql, phone, async (err, row) => {

        if(err) {
            return res.status(400).json({ error: err.sqlMessage });
        }else if(row.length) {
            return res.status(400).json({ message: "Phone already exists"});
        } else {
            //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create a user accouunt
        const userAccount = {
            "FirstName": firstName,
            "LastName": lastName,
            "Email": email,
            "Password": hashedPassword,
            "Phone": phone,
            "EnteredAmount": enteredPrice
        }

        //Create user account
        db.query("INSERT INTO useraccount SET ?", userAccount, async (err, result) => {
            if(err) return res.status(400).json({ error: err.sqlMessage });
             // Create token
             const sql = 'SELECT * FROM useraccount WHERE Phone = ?';
            db.query(sql, phone, async (err, rows) => {

                if(err || !rows.length) return res.status(400).json({ error: err });
                // return res.status(200).json({});

                // if(!rows.length) return res.status(400).json({ error: "User account does not exist" });

                // Check password
                const validPassword = await bcrypt.compare(password, rows[0].Password);
                if(!validPassword) return res.status(400).json({ error: "Password is not valid" });
                
                // Create token
                const token = await jwt.sign({ Id: rows[0].id}, TOKEN_SECRET);
                // res.header('Authorization', token);
                // req.session.user = rows;

                return res.status(200).json(token);

            });
        });
        }
        // req.session.user = rows;

        // return res.status(200).json(rows);

    });

};

//Update user account
module.exports.editUserAccount = async (req, res) => {

    const id = req.params.id;
    let userAccount = req.body;
    const sql = 'UPDATE useraccount SET ?  WHERE id = ?';
    db.query(sql, [userAccount, id], (err, result) => {
        if(err) return res.status(400).json({ error: err.sqlMessage });
        res.status(200).json(result);

    });

};

//Delete user account
module.exports.deleteUserAccount = async (req, res) => {

    const id = req.params.id;
    const sql = 'DELETE FROM useraccount WHERE Email = ?';
    db.query(sql, id, (err, result) => {
        if(err) return res.status(400).json({ error: err.sqlMessage });
        res.status(200).json(result);

    });

};
