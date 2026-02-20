const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth routes', () => {
  afterAll(async () => {
    await User.deleteMany({});
  });

  test('Register organization and admin, then login', async () => {
    const registerRes = await request(app).post('/api/auth/register-organization').send({
      orgName: 'TestOrg',
      orgEmail: 'org@test.com',
      orgPhone: '1234567890',
      adminFullName: 'Admin User',
      adminEmail: 'admin@test.com',
      adminPassword: 'password123'
    });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body).toHaveProperty('token');

    const loginRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'password123' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});
