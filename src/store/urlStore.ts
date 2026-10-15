export interface UrlRecord {
  id: number;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export interface UrlStore {
  create(originalUrl: string): Promise<UrlRecord>;
  findById(id: number): Promise<UrlRecord | null>;
  incrementClicks(id: number): Promise<void>;
}

export class InMemoryUrlStore implements UrlStore {
  private data = new Map<number, UrlRecord>();
  private nextId = 1;

  async create(originalUrl: string) {
    const record = { id: this.nextId++, originalUrl, clicks: 0, createdAt: new Date().toISOString() };
    this.data.set(record.id, record);
    return { ...record };
  }

  async findById(id: number) {
    const r = this.data.get(id);
    return r ? { ...r } : null;
  }

  async incrementClicks(id: number) {
    const r = this.data.get(id);
    if (r) r.clicks++;
  }
}
