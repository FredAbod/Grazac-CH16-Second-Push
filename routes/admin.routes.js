const express = require("express");
const { isAuthenticated } = require("../utils/auth");
const { getAllUsers, makeAdmin } = require("../controller/admin.controller");
const route = express.Router();

route.get("/getAllUsers", isAuthenticated, getAllUsers);
route.patch("/makeAdmin/:id", isAuthenticated, makeAdmin);

module.exports = route;