module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',  // Utilise babel-jest pour transformer tous les fichiers JS
  },
  testEnvironment: 'node',  // Important pour les tests côté serveur
};
