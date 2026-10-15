import { createApp } from './app.js';
import { createUrlService } from './services/urlService.js';
import { SqliteUrlStore } from './store/sqliteUrlStore.js';
import { config } from './config.js';

const store = new SqliteUrlStore(config.dbFile);
const app = createApp(createUrlService(store));
const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
