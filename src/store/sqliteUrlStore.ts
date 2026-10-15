import Database from 'better-sqlite3';
import { type UrlRecord, type UrlStore } from './urlStore.js';

export class SqliteUrlStore implements UrlStore {
  private db: Database.Database;

  constructor(filename = 'data.db') {
    this.db = new Database(filename);
    this.db.exec('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, original_url TEXT NOT NULL, clicks INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
  }

  async create(originalUrl: string) {
    const info = this.db.prepare('INSERT INTO urls (original_url) VALUES (?)').run(originalUrl);
    return (await this.findById(Number(info.lastInsertRowid)))!;
  }

  async findById(id: number) {
    const row = this.db.prepare('SELECT id, original_url AS originalUrl, clicks, created_at AS createdAt FROM urls WHERE id = ?').get(id) as UrlRecord | undefined;
    return row ?? null;
  }

  async incrementClicks(id: number) {
    this.db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE id = ?').run(id);
  }

  close() {
    this.db.close();
  }
}
