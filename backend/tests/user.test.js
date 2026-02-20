const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('User routes', () => {
  let adminToken;

  beforeAll(async () => {
    // register org and admin
    const res = await request(app).post('/api/auth/register-organization').send({
      orgName: 'UsersOrg',
      adminFullName: 'Admin Two',
      adminEmail: 'admintwo@test.com',
      adminPassword: 'password123'
    });
    adminToken = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  test('Admin creates a user in their org', async () => {
    const createRes = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ fullName: 'Teacher One', email: 'teacher1@test.com', password: 'pass1234', role: 'teacher' });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty('email', 'teacher1@test.com');
  });
});
