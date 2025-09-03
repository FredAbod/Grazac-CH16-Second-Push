const express = require('express');
const { signup, login, updateUsername } = require('../controller/user.controller');
const { isAuthenticated } = require('../utils/auth');
const route = express.Router();


route.post('/signup', signup);
route.post('/login', login);
route.put('/updateUsername', isAuthenticated, updateUsername);

module.exports = route;