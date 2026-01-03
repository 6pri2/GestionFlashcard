import request from 'supertest';
import app from '../server.js';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { users, collections, flashcards } from '../db/schema.js';
import { eq } from 'drizzle-orm';

describe('Flashcard routes - complete coverage', () => {
  let user, admin, otherUser;
  let userToken, adminToken, otherToken;
  let publicFlashcardId, privateFlashcardId;

  beforeAll(async () => {
    // Récupérer tous les utilisateurs
    [user] = await db.select().from(users).where(eq(users.email, 'test@test.com'));
    [admin] = await db.select().from(users).where(eq(users.email, 'test2@test.com'));
    [otherUser] = await db.select().from(users).where(eq(users.email, 'test3@test.com'));

    // Générer les tokens
    userToken = jwt.sign({ userId: user.id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
    adminToken = jwt.sign({ userId: admin.id, admin: admin.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
    otherToken = jwt.sign({ userId: otherUser.id, admin: otherUser.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Récupérer les flashcards
    [publicFlashcard] = await db.select().from(flashcards).where(eq(flashcards.front_text, 'Paris'));
    [privateFlashcard] = await db.select().from(flashcards).where(eq(flashcards.front_text, 'Eric'));

    publicFlashcardId = publicFlashcard.id;
    privateFlashcardId = privateFlashcard.id;
  });

  // === PUBLIC FLASHCARD ===
  it('Public flashcard → accessible by owner', async () => {
    const res = await request(app).get(`/flashcard/${publicFlashcardId}`).set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.front_text).toBe('Paris');
  });

  it('Public flashcard → accessible by admin', async () => {
    const res = await request(app).get(`/flashcard/${publicFlashcardId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('Public flashcard → accessible by other user', async () => {
    const res = await request(app).get(`/flashcard/${publicFlashcardId}`).set('Authorization', `Bearer ${otherToken}`);
    expect(res.statusCode).toBe(200);
  });

  // === PRIVATE FLASHCARD ===
  it('Private flashcard → accessible by owner', async () => {
    const res = await request(app).get(`/flashcard/${privateFlashcardId}`).set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.front_text).toBe('Eric');
  });

  it('Private flashcard → accessible by admin', async () => {
    const res = await request(app).get(`/flashcard/${privateFlashcardId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('Private flashcard → forbidden for non-owner non-admin', async () => {
    const res = await request(app).get(`/flashcard/${privateFlashcardId}`).set('Authorization', `Bearer ${otherToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('It is not your flashcard and this collection is private !');
  });

  // === INVALID CASES ===
  it('Flashcard does not exist → 404', async () => {
    const res = await request(app)
      .get(`/flashcard/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Flashcard not found !');
  });

  it('Invalid UUID → 400', async () => {
    const res = await request(app).get(`/flashcard/not-a-uuid`).set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid params');
  });

  it('No token → 401', async () => {
    const res = await request(app).get(`/flashcard/${publicFlashcardId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Access token required !');
  });

  it('Invalid token → 401', async () => {
    const res = await request(app).get(`/flashcard/${publicFlashcardId}`).set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid token !');
  });
});
