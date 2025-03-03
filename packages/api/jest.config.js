module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{ts,js}',
      '!src/**/*.d.ts',
    ],
  };