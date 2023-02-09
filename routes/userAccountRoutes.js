const router = require('express').Router();
const { verifyToken } = require('../controllers/authentication');

//Import userAccount controller
const UserAccountController = require('../controllers/userAccountController');

//Get all UserAccounts
router.get('/', UserAccountController.getAllUserAccounts);

//Get UserAccount By Id
router.get('/user/profile/:id', UserAccountController.getUser);

//Post UserAccount
router.post('/create', UserAccountController.createUserAccount);

//Login User
router.post('/login', UserAccountController.loginUser);

//Put UserAccount
router.put('/user/edit/:id', UserAccountController.editUserAccount);

//Delete UserAccount
router.delete('/delete/:id', UserAccountController.deleteUserAccount);


module.exports = router;