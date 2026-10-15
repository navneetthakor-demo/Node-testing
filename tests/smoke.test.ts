import request from 'supertest';
import { createApp } from '../src/app.js';
import { createUrlService } from '../src/services/urlService.js';
import { SqliteUrlStore } from '../src/store/sqliteUrlStore.js';

it('shortens and redirects end to end', async () => {
  const store = new SqliteUrlStore(':memory:');
  const app = createApp(createUrlService(store));

  const created = await request(app).post('/api/shorten').send({ url: 'https://google.com' });
  expect(created.status).toBe(201);

  const redirect = await request(app).get(created.body.shortUrl);
  expect(redirect.status).toBe(302);
  expect(redirect.headers.location).toBe('https://google.com');

  store.close();
});
