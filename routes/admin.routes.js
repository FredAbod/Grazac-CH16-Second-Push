const express = require("express");
const { isAuthenticated } = require("../utils/auth");
const { getAllUsers } = require("../controller/admin.controller");
const route = express.Router();

route.get("/getAllUsers", isAuthenticated, getAllUsers);
// route.get("/getAllUsers", getAllUsers);


module.exports = route;