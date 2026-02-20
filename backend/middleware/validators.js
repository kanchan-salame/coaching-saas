const { body, validationResult } = require('express-validator');

exports.validate = (checks) => {
  return async (req, res, next) => {
    await Promise.all(checks.map((check) => check.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  };
};

exports.registerOrganizationChecks = [
  body('orgName').notEmpty().withMessage('Organization name is required'),
  body('adminFullName').notEmpty().withMessage('Admin full name is required'),
  body('adminEmail').isEmail().withMessage('Valid admin email is required'),
  body('adminPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginChecks = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.createUserChecks = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').notEmpty().withMessage('Role is required'),
];

exports.createOrganizationChecks = [
  body('name').notEmpty().withMessage('Organization name is required'),
];
