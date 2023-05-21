import { Entry } from '../../models/Entry';
import { Platform } from '../../models/Platform';

export abstract class Retriever {
  private cache: Map<string, { lastUpdated: string; entries: Entry[] }>;
  private readonly cacheExpirationMinutes: number;
  private readonly enableCache: boolean;

  constructor(
    protected readonly baseSearchUrl: string,
    protected readonly platform: Platform,
  ) {
    this.cache = new Map();
    this.cacheExpirationMinutes = Number(
      process.env.CACHE_EXPIRATION_MINUTES || 24 * 60,
    );
    this.enableCache = process.env.ENABLE_CACHE === 'true';
  }

  abstract retrieve(searchTerm: string): Promise<Entry[]>;

  public async search(searchTerm: string): Promise<Entry[]> {
    try {
      if (this.enableCache) {
        const cached = await this.tryCache(searchTerm);
        if (cached !== undefined) return cached;
        const retrieved = await this.retrieve(searchTerm);
        await this.saveToCache(searchTerm, retrieved);
        return retrieved;
      } else {
        return this.retrieve(searchTerm);
      }
    } catch (e: unknown) {
      console.error(
        `Error while searching ${searchTerm} on ${this.platform}`,
        e,
      );
      return [
        {
          platform: this.platform,
          title: 'backend-error',
          description: '',
          imageUrl: '',
          link: '',
          language: 'en',
          seasons: new Map(),
        },
      ];
    }
  }

  private async tryCache(searchTerm: string): Promise<Entry[] | undefined> {
    const cached = this.cache.get(searchTerm);
    if (!cached) return undefined;

    const now = new Date().getTime();
    const lastUpdated = new Date(cached.lastUpdated).getTime();
    const diff = now - lastUpdated;
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes > this.cacheExpirationMinutes) {
      // Cache has expired
      this.cache.delete(searchTerm);
      return undefined;
    }

    return cached.entries;
  }

  private async saveToCache(
    searchTerm: string,
    entries: Entry[],
  ): Promise<void> {
    this.cache.set(searchTerm, {
      lastUpdated: new Date().toISOString(),
      entries,
    });
  }
}
