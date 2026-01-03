import { seed } from './src/db/seed.js';

beforeAll(async () => {
  console.log('Seeding test database...');
  await seed();
});