import { seed } from './src/db/seed.js';

beforeAll(async () => {
  await seed();
});


afterAll(async () => {
  await seed();
});