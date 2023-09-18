import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@queuemanager': '<rootDir>/../../libs/queue-manager/src'
  },
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
};

export default config;
