const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { validate, createOrganizationChecks } = require('../middleware/validators');

// super_admin creates organizations
router.post('/', authenticateToken, authorizeRoles('super_admin'), validate(createOrganizationChecks), orgController.createOrganization);
// super_admin list all organizations
router.get('/', authenticateToken, authorizeRoles('super_admin'), orgController.listOrganizations);

// organization-scoped operations: get and update org by id
router.get('/:orgId', authenticateToken, authorizeRoles('admin', { requireOrg: true, param: 'orgId' }), orgController.getOrganization);
router.put('/:orgId', authenticateToken, authorizeRoles('admin', { requireOrg: true, param: 'orgId' }), orgController.updateOrganization);

module.exports = router;
