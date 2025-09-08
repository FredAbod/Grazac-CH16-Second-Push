const express = require('express');
const { signup, login, updateUsername, verifyOtp, forgotPassword, resetPassword } = require('../controller/user.controller');
const { isAuthenticated } = require('../utils/auth');
const route = express.Router();


route.post('/signup', signup);
route.post('/login', login);
route.put('/updateUsername', isAuthenticated, updateUsername);
route.put('/verify', verifyOtp);
route.put('/forgotPassword', forgotPassword);
route.put('/resetPassword', resetPassword);


module.exports = route;