import { Entry } from '../../models/Entry';
import { Platform } from '../../models/Platform';
import { Cache } from '../../util/cache/Cache';

/**
 * Abstract class for retrieving entries from a given platform.
 */
export abstract class Retriever {
  private readonly enableCache: boolean;

  constructor(
    protected readonly baseSearchUrl: string,
    protected readonly platform: Platform,
    protected readonly cacheService: Cache<string, Entry[]>,
  ) {
    this.enableCache = process.env.ENABLE_CACHE === 'true';
  }

  abstract retrieve(searchTerm: string): Promise<Entry[]>;

  public async search(searchTerm: string): Promise<Entry[]> {
    try {
      if (this.enableCache) {
        const cacheKey = `${this.platform}-${searchTerm}}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached !== undefined) return cached;
        const retrieved = await this.retrieve(searchTerm);
        await this.cacheService.set(cacheKey, retrieved);
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
}
