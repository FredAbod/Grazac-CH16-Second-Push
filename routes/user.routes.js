const express = require('express');
const { signup, login, updateUsername, verifyOtp, forgotPassword, resetPassword, uploadProfilePicture } = require('../controller/user.controller');
const { isAuthenticated } = require('../utils/auth');
const upload = require('../config/multer');
const route = express.Router();


route.post('/signup', signup);
route.post('/login', login);
route.put('/updateUsername', isAuthenticated, updateUsername);
route.put('/verify', verifyOtp);
route.put('/forgotPassword', forgotPassword);
route.put('/resetPassword', resetPassword);
route.post('/uploadProfilePicture', isAuthenticated, upload.single('image'), uploadProfilePicture);


module.exports = route;