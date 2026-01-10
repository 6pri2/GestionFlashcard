import request from 'supertest';
import app from '../server.js';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { users, collections, flashcards } from '../db/schema.js';
import { eq } from 'drizzle-orm';

describe('Collection routes - complete coverage', () => {
  let user, admin, otherUser;
  let userToken, adminToken, otherToken;
  let publicCollectionId, privateCollectionId;
  let publicCollection, privateCollection;

  beforeAll(async () => {
    [user] = await db.select().from(users).where(eq(users.email, 'test@test.com'));
    [admin] = await db.select().from(users).where(eq(users.email, 'test2@test.com'));
    [otherUser] = await db.select().from(users).where(eq(users.email, 'test3@test.com'));

    userToken = jwt.sign({ userId: user.id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
    adminToken = jwt.sign({ userId: admin.id, admin: admin.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
    otherToken = jwt.sign({ userId: otherUser.id, admin: otherUser.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });

    [publicCollection] = await db.select().from(collections).where(eq(collections.is_private, false));
    [privateCollection] = await db.select().from(collections).where(eq(collections.is_private, true));

    publicCollectionId = publicCollection.id;
    privateCollectionId = privateCollection.id;
  });

  // ================= CREATE =================
  describe('POST /collection/createCollection', () => {
    it('Create collection → success', async () => {
      const res = await request(app)
        .post('/collection/createCollection')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Nouvelle collection', description: 'Description test', is_private: false });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Question created');
      expect(res.body.data).toHaveProperty('id');
    });

    it('Create collection → invalid body → 400', async () => {
      const res = await request(app)
        .post('/collection/createCollection')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: '', description: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid body');
    });

    it('Create collection → no token → 401', async () => {
      const res = await request(app)
        .post('/collection/createCollection')
        .send({ title: 'Test', description: 'Test' });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Access token required !');
    });

    it('Create collection → invalid token → 401', async () => {
      const res = await request(app)
        .post('/collection/createCollection')
        .set('Authorization', 'Bearer invalidtoken')
        .send({ title: 'Test', description: 'Test' });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid token !');
    });
  });

  // ================= UPDATE =================
  describe('PATCH /collection/updateCollection/:id', () => {
    it('Update collection → owner success', async () => {
      const res = await request(app)
        .patch(`/collection/updateCollection/${publicCollectionId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Updated title' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Collection mise à jour');
      expect(res.body.data.title).toBe('Updated title');
    });

    it('Update collection → admin success', async () => {
      const res = await request(app)
        .patch(`/collection/updateCollection/${publicCollectionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Admin update' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.description).toBe('Admin update');
    });

    it('Update collection → non-owner → 403', async () => {
      const res = await request(app)
        .patch(`/collection/updateCollection/${publicCollectionId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hack' });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Vous n\'êtes pas autorisé à modifier cette collection !');
    });

    it('Update collection → empty body → 400', async () => {
      const res = await request(app)
        .patch(`/collection/updateCollection/${publicCollectionId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Aucun champ à mettre à jour fourni.');
    });

    it('Update collection → invalid UUID → 400', async () => {
      const res = await request(app)
        .patch('/collection/updateCollection/not-a-uuid')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Test' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid params');
    });
  });

  // ================= GET =================
  describe('GET /collection/collectionById/:id', () => {
    it('Get public collection → anyone success', async () => {
      const res = await request(app)
        .get(`/collection/collectionById/${publicCollectionId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title');
    });

    it('Get private collection → owner success', async () => {
      const res = await request(app)
        .get(`/collection/collectionById/${privateCollectionId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(privateCollectionId);
    });

    it('Get private collection → admin success', async () => {
      const res = await request(app)
        .get(`/collection/collectionById/${privateCollectionId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('Get private collection → non-owner → 403', async () => {
      const res = await request(app)
        .get(`/collection/collectionById/${privateCollectionId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('It is not your collection and this collection is private !');
    });

    it('Get collection → invalid UUID → 400', async () => {
      const res = await request(app)
        .get('/collection/collectionById/not-a-uuid')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid params');
    });
  });

  // ================= MY COLLECTION =================
  describe('GET /collection/myCollection', () => {
    it('Get my collections → success', async () => {
      const res = await request(app)
        .get('/collection/myCollection')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('flashcards');
    });
  });

  // ================= DELETE =================
  
  describe('DELETE /collection/deleteCollection/:id', () => {

    let nonOwnerCollectionId;

    beforeAll(async () => {
        const [collection] = await db.insert(collections).values({
        title: 'ToBeDeleted',
        description: 'Collection for non-owner test',
        user_id: user.id,
        is_private: true
        }).returning();
        nonOwnerCollectionId = collection.id;
    });

    it('Delete collection → owner success', async () => {
        const res = await request(app)
        .delete(`/collection/deleteCollection/${nonOwnerCollectionId}`)
        .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Collection deleted !');
    });

    it('Delete collection → non-owner → 403', async () => {
        const [collection] = await db.insert(collections).values({
        title: 'NonOwnerTest',
        description: 'Collection for non-owner test',
        user_id: user.id,
        is_private: true
        }).returning();
        const collectionId = collection.id;

        const res = await request(app)
        .delete(`/collection/deleteCollection/${collectionId}`)
        .set('Authorization', `Bearer ${otherToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe('It is not your collection and this collection is private !');
    });

    it('Delete collection → admin success', async () => {
        const [collection] = await db.insert(collections).values({
        title: 'AdminDeleteTest',
        description: 'Collection for admin test',
        user_id: user.id,
        is_private: true
        }).returning();
        const collectionId = collection.id;

        const res = await request(app)
        .delete(`/collection/deleteCollection/${collectionId}`)
        .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Collection deleted !');
    });
    });

});
