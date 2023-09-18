import type { Config } from 'jest';

import baseConfig from './jest.config';

const config: Config = {
  ...baseConfig,
  testRegex: 'test/integration/.*\\.test\\.ts$',
  setupFilesAfterEnv: [
    "<rootDir>/test/setup-integration.ts"
  ],
};

export default config;
