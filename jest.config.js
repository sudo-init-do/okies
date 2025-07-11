// jest.config.js
module.exports = {
  roots: ['<rootDir>/src'],              // ← drop the test/ root
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
  passWithNoTests: true,
};
