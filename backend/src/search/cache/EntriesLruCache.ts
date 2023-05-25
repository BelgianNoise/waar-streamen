import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { Entry } from '../../models/Entry';

@Injectable()
export class EntriesLruCache extends LRUCache<string, Entry[]> {
  constructor() {
    const cacheExpirationMinutes = Number(
      process.env.CACHE_RETENTION_MINUTES || 24 * 60,
    );
    super({
      // From docs: (https://www.npmjs.com/package/lru-cache)
      // Even if ttl tracking is enabled, it is strongly recommended
      // to set a max to prevent unbounded growth of the cache.
      // See "Storage Bounds Safety" below.
      max: 1000,
      ttl: 1000 * 60 * cacheExpirationMinutes,
      ttlAutopurge: false,
    });
  }
}
