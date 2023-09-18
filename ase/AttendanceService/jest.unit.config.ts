import type { Config } from 'jest';

import baseConfig from './jest.config';

const config: Config = {
  ...baseConfig,
  testRegex: 'test/unit/.*\\.test\\.ts$',
};

export default config;
