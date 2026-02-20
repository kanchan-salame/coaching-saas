# SaaS Authentication Backend

This backend provides a multi-tenant SaaS authentication system using Node.js, Express, and MongoDB (Mongoose).

Features:
- Multi-tenant (Organization) support
- Roles: `super_admin`, `admin`, `manager`, `teacher`, `student`
- Register organization with admin
- Login with JWT
- Role-based access control

Quick start:

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
npm install
```

3. Start the server (development):

```bash
npm run start:dev
```

API endpoints (overview):
- `POST /api/auth/register-organization` - register an organization + admin
- `POST /api/auth/login` - login
- `POST /api/organizations` - create organization (super_admin)
- `POST /api/users` - create user in organization (admin)
