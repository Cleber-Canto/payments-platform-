/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Pool } from 'pg';

export const DatabaseProvider = {
  provide: Pool,
  useFactory: () => {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  },
};
