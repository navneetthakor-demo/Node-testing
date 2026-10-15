import { type UrlStore } from '../store/urlStore.js';
import { isValidUrl } from '../utils/url.js';
import { encode, decode } from '../utils/base62.js';
import { ValidationError, NotFoundError } from '../errors.js';

export function createUrlService(store: UrlStore) {
  async function findByCode(code: string) {
    const id = decode(code);
    const record = id === null ? null : await store.findById(id);
    if (!record) throw new NotFoundError('Short URL not found');
    return record;
  }

  return {
    async shorten(originalUrl: unknown) {
      if (typeof originalUrl !== 'string' || !isValidUrl(originalUrl)) throw new ValidationError('Invalid URL');
      const record = await store.create(originalUrl);
      return { ...record, code: encode(record.id) };
    },

    async resolve(code: string) {
      const record = await findByCode(code);
      await store.incrementClicks(record.id);
      return record.originalUrl;
    },

    async stats(code: string) {
      const record = await findByCode(code);
      return { ...record, code };
    },
  };
}

export type UrlService = ReturnType<typeof createUrlService>;
