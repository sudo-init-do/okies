// jest.config.js
module.exports = {
  // look in src/ and test/ folders
  roots: ['<rootDir>/src', '<rootDir>/test'],

  // match either .spec.ts or .test.ts
  testRegex: '.*\\.(spec|test)\\.ts$',

  // use ts-jest for TS
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  moduleFileExtensions: ['ts', 'js', 'json'],

  // collect coverage from all TS/JS files
  collectCoverageFrom: ['**/*.(t|j)s'],

  testEnvironment: 'node',

  // don’t fail if there are literally no tests
  passWithNoTests: true,
};
