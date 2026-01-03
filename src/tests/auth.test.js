import request from 'supertest';
import app from '../server.js';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

describe('Test auth route', () => {

  it('POST /auth/register → Create a new user', async () => {
    const body = {
      email: 'testuser@test.com',
      firstname: 'Pierre',
      lastname: 'Cailloux',
      password: 'securepassword123',
    };

    const res = await request(app)
      .post('/auth/register')
      .send(body);

    // Verify that the answer is correct
    expect(res.statusCode).toBe(201); 
    expect(res.body.message).toBe('User created'); 
    expect(res.body.userData).toHaveProperty('id'); 
    expect(res.body.userData.email).toBe('testuser@test.com'); 
    expect(res.body.userData.firstname).toBe('Pierre'); 
    expect(res.body.userData.lastname).toBe('Cailloux'); 
    expect(res.body).toHaveProperty('token'); 
    expect(typeof res.body.token).toBe('string'); 
  });

  it('POST /auth/register → Registration failed with invalid data', async () => {
    const body = {
      email: 'not-an-email', 
      firstname: 'J',
      lastname: 'D', 
      password: '123',
    };

    const res = await request(app)
      .post('/auth/register')
      .send(body);

    // Verify that the answer is correct
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid body'); 
    expect(res.body.details).toHaveLength(4); 
  });

});

describe('Test auth login route', () => {

  it('POST /auth/login → Login successful', async () => {
    const body = {
      email: 'testuser@test.com',
      password: 'securepassword123',
    };

    const res = await request(app)
      .post('/auth/login')
      .send(body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User logged in');

    expect(res.body.userData).toHaveProperty('id');
    expect(res.body.userData.email).toBe('testuser@test.com');

    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('POST /auth/login → Login failed with invalid body', async () => {
    const body = {
      email: 'not-an-email',
      password: '123',
    };

    const res = await request(app)
      .post('/auth/login')
      .send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid body');
    expect(res.body.details).toHaveLength(2);
  });

  it('POST /auth/login → Login failed with non-existing email', async () => {
    const body = {
      email: 'unknown@test.com',
      password: 'securepassword123',
    };

    const res = await request(app)
      .post('/auth/login')
      .send(body);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid email or password !');
  });

  it('POST /auth/login → Login failed with wrong password', async () => {
    const body = {
      email: 'testuser@test.com',
      password: 'wrongpassword',
    };

    const res = await request(app)
      .post('/auth/login')
      .send(body);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid email or password !');
  });

});


describe('GET /auth/information → Protected route', () => {
  let validToken;
  let userId;

  beforeAll(async () => {
    const [user] = await db.select().from(users).where(eq(users.email, 'test@test.com'));
    userId = user.id;

    validToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        admin: user.admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  });

  it('GET /auth/information → should return user info with valid token', async () => {
    const res = await request(app)
      .get('/auth/information')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User information :');
    expect(res.body.userData).toHaveProperty('id', userId);
    expect(res.body.userData).toHaveProperty('firstname');
    expect(res.body.userData).toHaveProperty('lastname');
    expect(res.body.userData).toHaveProperty('email');
  });

  it('GET /auth/information → should fail without token', async () => {
    const res = await request(app).get('/auth/information');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Access token required !');
  });

  it('GET /auth/information → should fail with invalid token', async () => {
    const res = await request(app)
      .get('/auth/information')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid token !');
  });

  it('GET /auth/information → should fail if user does not exist', async () => {
    const fakeToken = jwt.sign(
      {
        userId: '00000000-0000-0000-0000-000000000000',
        email: 'nouser@test.com',
        firstname: 'No',
        lastname: 'User',
        admin: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const res = await request(app)
      .get('/auth/information')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});
