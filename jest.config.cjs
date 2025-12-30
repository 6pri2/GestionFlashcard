module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',  // Utilise babel-jest pour transformer tous les fichiers JS
  },
  testEnvironment: 'node',  // Important pour les tests côté serveur
};
