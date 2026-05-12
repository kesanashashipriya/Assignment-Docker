const request = require('supertest');
const app = require('../src/app');

describe('Auth API Endpoints', () => {
  const testUser = {
    username: 'testuser',
    password: 'TestPassword123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully.');
      expect(res.body.userId).toBeDefined();
    });

    it('should return 400 if username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: 'password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Username and password are required.');
    });

    it('should return 409 if username already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('Username already exists.');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(testUser);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful.');
      expect(res.body.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid credentials.');
    });

    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Username and password are required.');
    });
  });

  describe('Protected Route - GET /api/tasks', () => {
    it('should return 401 without a token', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Access denied. No token provided.');
    });

    it('should return 403 with an invalid token', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Invalid or expired token.');
    });

    it('should return tasks with a valid token', async () => {
      // Login first to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send(testUser);

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks).toBeDefined();
      expect(Array.isArray(res.body.tasks)).toBe(true);
    });
  });
});
