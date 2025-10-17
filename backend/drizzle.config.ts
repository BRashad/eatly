import type { Config } from 'drizzle-kit';
import { environment } from './src/config/environment';

export default {
  schema: './src/models/*.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: environment.databaseUrl,
  },
} satisfies Config;
