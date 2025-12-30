import request from 'supertest';
import app from '../server.js';

describe('Tests des routes d\'authentification', () => {

  it('POST /auth/login → Se connecter et récupérer un token', async () => {
    const body = {
      email: 'test@test.com',
      password: 'motdepasse'
    };

    const res = await request(app)
      .post('/auth/login')
      .send(body);

    // Vérifier que la réponse est correcte
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User logged in');  
    expect(res.body.userData).toHaveProperty('id');
    expect(res.body.userData).toHaveProperty('email');
    expect(res.body.userData.email).toBe('test@test.com'); 
    expect(res.body).toHaveProperty('token'); 
    expect(typeof res.body.token).toBe('string'); 
  });

});
