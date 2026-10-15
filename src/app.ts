import express, { type Request, type Response, type NextFunction } from 'express';
import { type UrlService } from './services/urlService.js';
import { ValidationError, NotFoundError } from './errors.js';

export function createApp(service: UrlService) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/shorten', async (req, res) => {
    const record = await service.shorten(req.body?.url);
    res.status(201).json({ code: record.code, shortUrl: `/${record.code}` });
  });

  app.get('/api/stats/:code', async (req, res) => {
    res.json(await service.stats(req.params.code));
  });

  app.get('/:code', async (req, res) => {
    res.redirect(302, await service.resolve(req.params.code));
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'Invalid JSON body' });
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
