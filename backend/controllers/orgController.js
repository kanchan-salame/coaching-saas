const Organization = require('../models/Organization');
const User = require('../models/User');

exports.createOrganization = async (req, res) => {
  const { name, email, phone, subscriptionPlan, adminFullName, adminEmail, adminPassword } = req.body;

  if (!name) return res.status(400).json({ message: 'Organization name required' });

  const org = await Organization.create({ name, email, phone, subscriptionPlan });

  // Optionally create an admin user for the organization when details provided
  let admin = null;
  if (adminFullName && adminEmail && adminPassword) {
    const existing = await User.findOne({ email: adminEmail });
    if (existing) return res.status(400).json({ message: 'Admin email already exists' });
    admin = await User.create({ fullName: adminFullName, email: adminEmail, password: adminPassword, role: 'admin', organizationId: org._id });
  }

  res.status(201).json({ organization: org, admin: admin ? { id: admin._id, email: admin.email } : null });
};

exports.listOrganizations = async (req, res) => {
  const orgs = await Organization.find();
  res.json(orgs);
};

exports.getOrganization = async (req, res) => {
  const { orgId } = req.params;
  const org = await Organization.findById(orgId);
  if (!org) return res.status(404).json({ message: 'Organization not found' });
  res.json(org);
};

exports.updateOrganization = async (req, res) => {
  const { orgId } = req.params;
  const updates = req.body;
  const org = await Organization.findByIdAndUpdate(orgId, updates, { new: true });
  if (!org) return res.status(404).json({ message: 'Organization not found' });
  res.json(org);
};
