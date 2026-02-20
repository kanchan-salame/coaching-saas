const User = require('../models/User');

exports.createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  const orgId = req.user.organizationId;

  if (!fullName || !email || !password || !role) return res.status(400).json({ message: 'Missing required fields' });

  // Admins can only create users within their organization
  if (!orgId) return res.status(400).json({ message: 'Admin has no organization' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const allowedRoles = ['admin', 'manager', 'teacher', 'student'];
  if (!allowedRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

  const user = await User.create({ fullName, email, password, role, organizationId: orgId });
  res.status(201).json({ id: user._id, email: user.email, fullName: user.fullName, role: user.role });
};

exports.listUsers = async (req, res) => {
  // Allow listing by :orgId param (for super_admin or org-scoped requests)
  const paramOrgId = req.params?.orgId;
  const orgId = paramOrgId || req.user.organizationId;
  if (!orgId) return res.status(400).json({ message: 'Organization missing' });
  const users = await User.find({ organizationId: orgId }).select('-password');
  res.json(users);
};
