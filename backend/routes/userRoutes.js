const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { validate, createUserChecks } = require('../middleware/validators');

// create user within admin's organization
router.post('/', authenticateToken, authorizeRoles('admin'), validate(createUserChecks), userController.createUser);

// list users for current user's organization
router.get('/', authenticateToken, authorizeRoles('admin','manager'), userController.listUsers);

// list users for a given organization (super_admin or org-scoped admin/manager)
router.get('/org/:orgId', authenticateToken, authorizeRoles('admin','manager', { requireOrg: true, param: 'orgId' }), userController.listUsers);

module.exports = router;
