const express = require('express');
const router = express.Router();
const RegisterController = require('../../controllers/auth/register.controller');

router.post('/', RegisterController.validate('create'), RegisterController.create);

module.exports = router;
