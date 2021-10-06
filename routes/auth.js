const express = require("express");

const loginController = require("../controller/auth/login");
const registerController = require("../controller/auth/register");

const router = express.Router();

router.post("/login", loginController.login);
router.post("/register", registerController.register);

module.exports = router;
