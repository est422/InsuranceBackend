// require('dotenv').config();
const jwt = require('jsonwebtoken');
// const { TOKEN_SECRET } = require('../config/default.json');
const decode = require('jsonwebtoken/decode');
// const User = require('../models/users');
const db = require('../config/connectDB');

module.exports.verifyToken = async (req, res, next) => {

    const token = req.header('Authorization');
    if(!token || token === null) return res.status(401).send('unautorized');

    try{

        const verified = jwt.verify(token, TOKEN_SECRET);
        
        if(verified) {
            req.user = verified;
            return next();
        }
        
        // const verified = jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        //     if(err) return res.status(401).json({ error: err.message});
        //     next();

        //     const user = await db.useraccount.findByPK(req.user.UserAccountId);
        //     console.log('user', decoded.UserAccountId);
        //     const user = await User.findOne({ _id: decoded._id });
        //     const sql = 'SELECT * FROM useraccount WHERE UserAccountId = ? ';
        //     await db.query(sql, decoded.UserAccountId, (err, results) => {
        //         if(err) throw err;
        //         // console.log('result', results);
        //         // req.session.user = results[0];
        //         req.userAccount = decoded;
        //         next();

        //     });
        //     req.user = user;
        //     console.log('Request user', req.user);
        //     next();
        // });
        // req.user = verifed;
        
    }catch(err){
        res.status(400).json({ error: err.message});
    }
}