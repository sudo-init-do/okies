// jest.config.js
module.exports = {
  roots: ['<rootDir>/src'],              // ← only src here
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
  passWithNoTests: true,
};
