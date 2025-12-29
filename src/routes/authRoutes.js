const express = require('express');
const authController = require('../controllers/authController');
const { loginValidation } = require('../validations/validators');

const router = express.Router();

router.post('/login', loginValidation, authController.login);

module.exports = router;
