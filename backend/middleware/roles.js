exports.authorizeRoles = (...args) => {
  // allow call patterns:
  // authorizeRoles('admin','manager')
  // authorizeRoles('admin','manager', { requireOrg: true, param: 'orgId' })
  let options = {};
  let allowedRoles = args;
  if (args.length && typeof args[args.length - 1] === 'object') {
    options = args[args.length - 1] || {};
    allowedRoles = args.slice(0, -1);
  }

  const orgParam = options.param || 'orgId';
  const requireOrg = !!options.requireOrg;

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const userRole = req.user.role;

    // super_admin bypasses tenant restrictions
    if (userRole === 'super_admin') return next();

    // allowed role check
    if (!allowedRoles.includes(userRole)) return res.status(403).json({ message: 'Forbidden' });

    // if org check is not required, allow
    if (!requireOrg) return next();

    // determine target organization id from params/body/query
    const targetOrgId = req.params?.[orgParam] || req.body?.organizationId || req.query?.organizationId;

    // if no target provided, allow (route may not be organization-scoped)
    if (!targetOrgId) return next();

    // ensure the user's organization matches the target
    const userOrgId = req.user.organizationId ? String(req.user.organizationId) : null;
    if (userOrgId && userOrgId === String(targetOrgId)) return next();

    return res.status(403).json({ message: 'Forbidden - organization mismatch' });
  };
};
