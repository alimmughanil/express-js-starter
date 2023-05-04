const express = require('express');
const router = express.Router();
const LoginController = require('../../controllers/auth/login.controller');
const verifyToken = require('../../middlewares/verifyToken');

router.post('/', verifyToken, LoginController.destroy);

module.exports = router;
