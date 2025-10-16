import express from 'express';

import { environment } from '@config/environment';
import { logInfo } from '@utils/logger';

const app = express();

app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(environment.port, () => {
  logInfo('API server listening', { port: environment.port, env: environment.nodeEnv });
});