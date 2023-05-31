import { LRUCache } from 'lru-cache';
import { Entry } from '../../models/Entry';
import { Platform } from '../../models/Platform';
import { SearchOptions } from '../../models/SearchOptions';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * Abstract class for retrieving entries from a given platform.
 */
export abstract class Retriever {
  private readonly enableCache: boolean;

  constructor(
    @InjectPinoLogger(Retriever.name)
    protected readonly logger: PinoLogger,
    protected readonly baseSearchUrl: string,
    public readonly platform: Platform,
    protected readonly cacheService: LRUCache<string, Entry[]>,
  ) {
    this.enableCache = process.env.ENABLE_CACHE === 'true';
  }

  abstract retrieve(
    searchTerm: string,
    searchOptions: SearchOptions,
  ): Promise<Entry[]>;

  public async search(
    searchTerm: string,
    searchOptions: SearchOptions,
  ): Promise<Entry[]> {
    try {
      if (this.enableCache) {
        const cacheKey = `${this.platform}-${searchOptions.fetchDepth}-${searchTerm}}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached !== undefined) return cached;
        const retrieved = await this.retrieve(searchTerm, searchOptions);
        await this.cacheService.set(cacheKey, retrieved);
        return retrieved;
      } else {
        return await this.retrieve(searchTerm, searchOptions);
      }
    } catch (e: unknown) {
      this.logger.error(`Error while searching "${searchTerm}"`, e);
      return [
        {
          platform: this.platform,
          title: 'backend-error',
          description: '',
          imageUrl: '',
          link: '',
          language: '-',
          seasons: new Map(),
        },
      ];
    }
  }
}
