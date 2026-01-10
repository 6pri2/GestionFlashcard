import { seed } from './seed.js';

await seed();

console.log('email : test@test.com');
console.log('password : motdepasse');

process.exit(0);
