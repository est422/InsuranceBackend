const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('../config/connectDB');
const { createUserSchema, loginSchema, updateUserSchema } = require('../middleware/userSchema');
// const { TOKEN_SECRET } = require('../config/default.json');

//Get user by id
module.exports.getUser = async (req, res) => {

    const userAccountId = req.params.id
    if (!userAccountId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Get user account by ID
        const sql = 'SELECT * FROM useraccount WHERE id = ?';
        const [result] = await db.promise().query(sql, [userAccountId]);

        // Check if user account exists
        if (result.length === 0) {
            return res.status(404).json({ message: 'User account not found' });
        }

        // Remove password from each user account object
        const sanitizedResult = result.map(user => {
            const { Password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        // Return the result
        return res.status(200).json({
            message: 'User account fetched successfully',
            data: sanitizedResult
        });
    } catch (err) {
        console.error('Error fetching user account:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

};
//Get all user accounts
module.exports.getAllUserAccounts = async (req, res) => {

    try{
        const sql = 'SELECT * FROM useraccount';
        const [result] = await db.promise().query(sql);

        // Remove password from each user account object
        const sanitizedResult = result.map(user => {
            const { Password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        // Return result
        return res.status(200).json({
            message: 'User accounts fetched successfully',
            data: sanitizedResult
        });

    }catch (err) {
        console.error('Error fetching user accounts:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

//Login user
module.exports.loginUser = async (req, res) => {

    // const {phone, password} = req.body;
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details.map(detail => detail.message)
        });
    }

    const { password, phone } = value;
    // Input validation
    // if (!phone || !password) {
    //     return res.status(400).json({ message: 'Missing required fields' });
    // }

    try {
        // Check if phone exists
        const sql = 'SELECT * FROM useraccount WHERE Phone = ?';
        const [rows] = await db.promise().query(sql, [phone]);

        if (!rows.length) {
            return res.status(400).json({ message: 'User account does not exist' });
        }

        // Check password validity
        const validPassword = await bcrypt.compare(password, rows[0].Password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token with user details
        const token = await jwt.sign(
            { Id: rows[0].id, Role: rows[0].Role }, 
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Return token in the response
        return res.status(200).json({
            message: 'Login successful',
            token: token,
            // userId: rows[0].id,
            // role: rows[0].Role
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

//Create user account
module.exports.createUserAccount = async (req, res, next) => {

    // const {firstName, lastName, email, password, phone, enteredPrice, role} = req.body;
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details.map(detail => detail.message)
        });
    }

    const { firstName, lastName, email, password, phone, enteredPrice } = value;

    try {
        // Check if phone number exists
        const sql = 'SELECT * FROM useraccount WHERE Phone = ?';
        const [existingUser] = await db.promise().query(sql, [phone]);

        if (existingUser.length) {
            return res.status(400).json({ message: 'User account creation failed' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // User account object
        const userAccount = {
            FirstName: firstName,
            LastName: lastName,
            Password: hashedPassword,
            Phone: phone,
            EnteredAmount: enteredPrice,
            Email: email,
            Role: "client"
        };

        // Create the user account
        const insertQuery = 'INSERT INTO useraccount SET ?';
        const [result] = await db.promise().query(insertQuery, userAccount);

        // Created user
        const userQuery = 'SELECT * FROM useraccount WHERE Phone = ?';
        const [userRows] = await db.promise().query(userQuery, [phone]);

        if (!userRows.length) {
            return res.status(400).json({ message: 'User account creation failed' });
        }

        // Check password validity
        const validPassword = await bcrypt.compare(password, userRows[0].Password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = await jwt.sign({ Id: userRows[0].id, Role: userRows[0].Role }, process.env.TOKEN_SECRET);

        // Return the token
        return res.status(200).json({ token });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

//Update user account
module.exports.updateUserAccount = (req, res, next) => {
    const userAccountId = req.params.id;
    // const { firstName, lastName, phone, email, enteredPrice } = req.body;
    const { error, value } = updateUserSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details.map(detail => detail.message)
        });
    }

    const { firstName, lastName, email, phone, enteredPrice } = value;

    const updatedFields = {};

    if (firstName) updatedFields.FirstName = firstName;
    if (lastName) updatedFields.LastName = lastName;
    if (phone) updatedFields.Phone = phone;
    if (email) updatedFields.Email = email;
    if (enteredPrice) updatedFields.EnteredAmount = enteredPrice;

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    const sql = 'UPDATE useraccount SET ? WHERE id = ?';
    db.query(sql, [updatedFields, userAccountId], (err, result) => {
        if (err) return res.status(400).json({ error: err.sqlMessage });

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User account not found' });
        }

        // Return success message and updated result
        return res.status(200).json({
            message: 'User account updated successfully',
            data: updatedFields
        });
    });
};

//Delete user account
module.exports.deleteUserAccount = async (req, res) => {
    const userAccountId = req.params.id;

    const sql = 'DELETE FROM useraccount WHERE id = ?';
    db.query(sql, [userAccountId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User account not found' });
        }

        // Successfully deleted
        res.status(200).json({
            message: 'User account deleted successfully',
            data: result
        });
    });
};
