import request from 'supertest';
import app from '../server.js';

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

  //it('GET /auth/information', async => {
    //TODO
  //});

});
