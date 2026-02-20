const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, registerOrganizationChecks, loginChecks } = require('../middleware/validators');

router.post('/register-organization', validate(registerOrganizationChecks), authController.registerOrganization);
router.post('/login', validate(loginChecks), authController.login);
router.post('/logout', authController.logout);

module.exports = router;
