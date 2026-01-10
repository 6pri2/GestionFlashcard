import request from 'supertest';
import app from '../server.js';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { users, collections, flashcards, progression } from '../db/schema.js';
import { eq } from 'drizzle-orm';

describe('Flashcard routes - complete coverage', () => {
    let user, admin, otherUser;
    let userToken, adminToken, otherToken;
    let publicFlashcardId, privateFlashcardId;
    let userCollectionId;
    let publicFlashcard;
    let privateFlashcard;

    beforeAll(async () => {
        [user] = await db.select().from(users).where(eq(users.email, 'test@test.com'));
        [admin] = await db.select().from(users).where(eq(users.email, 'test2@test.com'));
        [otherUser] = await db.select().from(users).where(eq(users.email, 'test3@test.com'));

        userToken = jwt.sign({ userId: user.id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
        adminToken = jwt.sign({ userId: admin.id, admin: admin.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
        otherToken = jwt.sign({ userId: otherUser.id, admin: otherUser.admin }, process.env.JWT_SECRET, { expiresIn: '24h' });

        [publicFlashcard] = await db.select().from(flashcards).where(eq(flashcards.front_text, 'Paris'));
        [privateFlashcard] = await db.select().from(flashcards).where(eq(flashcards.front_text, 'Eric'));

        publicFlashcardId = publicFlashcard.id;
        privateFlashcardId = privateFlashcard.id;

        const [collection] = await db
        .select()
        .from(collections)
        .where(eq(collections.user_id, user.id));

        userCollectionId = collection.id;
    });

    describe('GET /flashcard → get flashcard', () => {
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


    describe('POST /flashcard → create flashcard', () => {
    
        // ================= AUTH =================

        it('POST /flashcard → no token → 401', async () => {
            const res = await request(app).post('/flashcard').send({});
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Access token required !');
        });

        it('POST /flashcard → invalid token → 401', async () => {
            const res = await request(app)
            .post('/flashcard')
            .set('Authorization', 'Bearer invalidtoken')
            .send({});
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Invalid token !');
        });

        // ================= BODY =================

        it('POST /flashcard → invalid body → 400', async () => {
            const res = await request(app)
            .post('/flashcard')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                front_text: '',
                back_text: '',
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid body');
            expect(res.body.details.length).toBeGreaterThan(0);
        });

        it('POST /flashcard → invalid collection_id → 400', async () => {
            const res = await request(app)
            .post('/flashcard')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                front_text: 'Front',
                back_text: 'Back',
                collection_id: 'not-a-uuid',
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid body');
        });

        it('POST /flashcard → collection not owned → 403', async () => {
            const res = await request(app)
            .post('/flashcard')
            .set('Authorization', `Bearer ${otherToken}`)
            .send({
                front_text: 'Test',
                back_text: 'Test',
                collection_id: userCollectionId,
            });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe(
            'It is not your collection !'
            );
        });

        it('POST /flashcard → admin but not owner → 403', async () => {
        const res = await request(app)
            .post('/flashcard')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            front_text: 'Admin test',
            back_text: 'Denied',
            collection_id: userCollectionId,
            });

        expect(res.statusCode).toBe(403);
        });


        it('POST /flashcard → collection does not exist → 404', async () => {
            const res = await request(app)
            .post('/flashcard')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                front_text: 'Test',
                back_text: 'Test',
                collection_id: '00000000-0000-0000-0000-000000000000',
            });
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Collection not found');
        });

        // ================= SUCCESS =================

        it('POST /flashcard → success → 201', async () => {
            const res = await request(app)
            .post('/flashcard')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                front_text: 'Nouvelle carte',
                back_text: 'Nouvelle réponse',
                collection_id: userCollectionId,
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Flashcard created');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.front_text).toBe('Nouvelle carte');
        });
    });

    describe('PATCH /flashcard → update flashcard', () => {

        // ================= AUTH =================

        it('PATCH /flashcard/:id → no token → 401', async () => {
            const res = await request(app)
            .patch(`/flashcard/${publicFlashcardId}`)
            .send({ front_text: 'Updated' });

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Access token required !');
        });

        it('PATCH /flashcard/:id → invalid token → 401', async () => {
            const res = await request(app)
            .patch(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', 'Bearer invalidtoken')
            .send({ front_text: 'Updated' });

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Invalid token !');
        });

        // ================= PARAMS =================

        it('PATCH /flashcard/:id → invalid UUID → 400', async () => {
            const res = await request(app)
            .patch('/flashcard/not-a-uuid')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ front_text: 'Updated' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid params');
        });

        it('PATCH /flashcard/:id → flashcard not found → 404', async () => {
            const res = await request(app)
            .patch('/flashcard/00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ front_text: 'Updated' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Flashcard not found !');
        });

        // ================= BODY =================

        it('PATCH /flashcard/:id → invalid body → 400', async () => {
            const res = await request(app)
            .patch(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ front_text: '' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid body');
            expect(res.body.details.length).toBeGreaterThan(0);
        });

        it('PATCH /flashcard/:id → empty body → 400', async () => {
            const res = await request(app)
            .patch(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid body');
            expect(res.body.details[0].message).toBe('At least one field must be provided');
        });

        // ================= RIGHTS =================

        it('PATCH /flashcard/:id → non-owner → 403', async () => {
            const res = await request(app)
            .patch(`/flashcard/${privateFlashcardId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .send({ front_text: 'Hack' });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('It is not your flashcard !');
        });

        it('PATCH /flashcard/:id → admin → 403 (by design)', async () => {
            const res = await request(app)
            .patch(`/flashcard/${privateFlashcardId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ front_text: 'Admin edit' });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('It is not your flashcard !');
        });

        // ================= SUCCESS =================

        it('PATCH /flashcard/:id → success (partial update) → 200', async () => {
            const res = await request(app)
            .patch(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ front_text: 'Paris modifié' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Flashcard updated !');
        });

        it('PATCH /flashcard/:id → success (full update) → 200', async () => {
            const res = await request(app)
            .patch(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                front_text: 'Paris',
                back_text: 'France 🇫🇷',
                url_front: 'https://example.com/front.jpg',
                url_back: 'https://example.com/back.jpg',
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Flashcard updated !');
        });
    });

    describe('Flashcard /revise/:id', () => {

        // ================= AUTH =================
        it('No token → 401', async () => {
            const res = await request(app).patch(`/flashcard/revise/${publicFlashcard.id}`).send({ progress_level: 3 });
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Access token required !');
        });

        it('Invalid token → 401', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', 'Bearer invalidtoken')
                .send({ progress_level: 3 });
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Invalid token !');
        });

        // ================= PARAMS =================
        it('Invalid UUID → 400', async () => {
            const res = await request(app)
                .patch('/flashcard/revise/not-a-uuid')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 3 });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid params');
        });

        it('Flashcard does not exist → 404', async () => {
            const res = await request(app)
                .patch('/flashcard/revise/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 3 });
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Flashcard not found !');
        });

        // ================= BODY =================
        it('Invalid progress_level < 1 → 400', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 0 });
            expect(res.statusCode).toBe(400);
        });

        it('Invalid progress_level > 5 → 400', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 6 });
            expect(res.statusCode).toBe(400);
        });

        it('Invalid progress_level non-integer → 400', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 3.5 });
            expect(res.statusCode).toBe(400);
        });

        // ================= BUSINESS =================

        it('Public flashcard → owner can create progression → 201', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 2 });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Progression created');
            expect(res.body.data.progress_level).toBe(2);
        });

        it('Public flashcard → other user can create progression → 201', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({ progress_level: 3 });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Progression created');
            expect(res.body.data.progress_level).toBe(3);
        });

        it('Private flashcard → owner can create progression → 201', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${privateFlashcard.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 4 });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Progression created');
            expect(res.body.data.progress_level).toBe(4);
        });

        it('Private flashcard → other user cannot create progression → 403', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${privateFlashcard.id}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({ progress_level: 3 });
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('This collection is private and it is not your flashcard !');
        });

        // ================= UPDATE =================
        it('Public flashcard → owner can update progression → 200', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ progress_level: 5 });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Progression updated');
            expect(res.body.data.progress_level).toBe(5);
        });

        it('Public flashcard → other user can update progression → 200', async () => {
            const res = await request(app)
                .patch(`/flashcard/revise/${publicFlashcard.id}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({ progress_level: 1 });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Progression updated');
            expect(res.body.data.progress_level).toBe(1);
        });
    });



    describe('DELETE /flashcard/:id → delete flashcard', () => {

        // ================= AUTH =================

        it('DELETE /flashcard/:id → no token → 401', async () => {
            const res = await request(app).delete(`/flashcard/${publicFlashcardId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Access token required !');
        });

        it('DELETE /flashcard/:id → invalid token → 401', async () => {
            const res = await request(app)
            .delete(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', 'Bearer invalidtoken');

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Invalid token !');
        });

        // ================= PARAMS =================

        it('DELETE /flashcard/:id → invalid UUID → 400', async () => {
            const res = await request(app)
            .delete('/flashcard/not-a-uuid')
            .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid params');
            expect(res.body.details.length).toBeGreaterThan(0);
        });

        // ================= METIER =================

        it('DELETE /flashcard/:id → flashcard not found → 404', async () => {
            const res = await request(app)
            .delete('/flashcard/00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Flashcard not found !');
        });

        it('DELETE /flashcard/:id → forbidden for non-owner non-admin → 403', async () => {
            const res = await request(app)
            .delete(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', `Bearer ${otherToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('It is not your flashcard !');
        });

        // ================= SUCCESS =================

        it('DELETE /flashcard/:id → success by owner → 200', async () => {
            const res = await request(app)
            .delete(`/flashcard/${publicFlashcardId}`)
            .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Flashcard deleted !');

            const [deleted] = await db
            .select()
            .from(flashcards)
            .where(eq(flashcards.id, publicFlashcardId));

            expect(deleted).toBeUndefined();
        });

        it('DELETE /flashcard/:id → success by admin → 200', async () => {
            const res = await request(app)
            .delete(`/flashcard/${privateFlashcardId}`)
            .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Flashcard deleted !');
        });
    });

    describe('GET /flashcard/reviewAll → get all flashcards to review', () => {
        it('No token → 401', async () => {
            const res = await request(app).get('/flashcard/reviewAll');
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Access token required !');
        });

        it('Invalid token → 401', async () => {
            const res = await request(app)
                .get('/flashcard/reviewAll')
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe('Invalid token !');
        });

        it('No flashcards to review → 200 empty array', async () => {
            const res = await request(app)
                .get('/flashcard/reviewAll')
                .set('Authorization', `Bearer ${otherToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Aucune flashcard à réviser trouvée pour vous.');
        });

        it('Some flashcards to review → 200 with data', async () => {
            const res = await request(app)
                .get('/flashcard/reviewAll')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toBe(200);
            if (res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('id');
                expect(res.body[0]).toHaveProperty('front_text');
                expect(res.body[0]).toHaveProperty('back_text');
                expect(res.body[0]).toHaveProperty('progress_level');
            }
        });
    });



});


