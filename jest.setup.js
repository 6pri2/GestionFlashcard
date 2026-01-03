import { exec } from 'child_process';

beforeAll(async () => {
  console.log('Starting database seed...');

  // Attendre que le script de seed termine avant de continuer les tests
  await new Promise((resolve, reject) => {
    exec('node src/db/seed.js', (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        reject(err);
      }
      console.log(stdout);
      resolve();
    });
  });

  console.log('Database seeded successfully!');
});
