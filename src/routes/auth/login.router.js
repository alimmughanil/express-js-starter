const express = require('express');
const router = express.Router();
const LoginController = require('../../controllers/auth/login.controller');

router.post('/', LoginController.validate('create'), LoginController.create);

module.exports = router;
