const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname),
  preset: 'ts-jest',
  verbose: true,
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^@vssue/(.*)$': '<rootDir>/packages/@vssue/$1/src/index.ts',
  },
  testURL: 'https://vssue.js.org',
  testMatch: [
    '**/__tests__/**/*.(spec|test).[jt]s?(x)',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
  ],
}
