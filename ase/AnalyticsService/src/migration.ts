
import * as dotenv from 'dotenv';

import { createDataSource } from './data/data-source-creator';

dotenv.config();

export const dataSource = createDataSource();
