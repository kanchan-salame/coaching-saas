const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const generateToken = (user) => {
  const payload = { id: user._id, role: user.role, organizationId: user.organizationId };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

exports.registerOrganization = async (req, res) => {
  const { orgName, orgEmail, orgPhone, adminFullName, adminEmail, adminPassword } = req.body;

  if (!orgName || !adminFullName || !adminEmail || !adminPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existingUser = await User.findOne({ email: adminEmail });
  if (existingUser) return res.status(400).json({ message: 'Admin email already in use' });

  const organization = await Organization.create({ name: orgName, email: orgEmail, phone: orgPhone });

  const admin = await User.create({
    fullName: adminFullName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    organizationId: organization._id,
  });

  const token = generateToken(admin);
  // set httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60, // 1h
  });

  res.status(201).json({ organization, admin: { id: admin._id, email: admin.email, fullName: admin.fullName, role: admin.role } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  const user = await User.findOne({ email }).populate('organizationId');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isActive) return res.status(403).json({ message: 'User is inactive' });
  if (user.organizationId && user.organizationId.isActive === false) return res.status(403).json({ message: 'Organization is inactive' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  // set httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60, // 1h
  });

  res.json({ user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role, organizationId: user.organizationId } });
};

exports.logout = async (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
};
