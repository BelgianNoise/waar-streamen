import { Injectable, Logger } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import { vtmGoParser } from '../../../util/functions/VtmGoParser';
import { EntriesLruCache } from '../../cache/EntriesLruCache';
import { SearchOptions } from '../../../models/SearchOptions';

/**
 * Retrieves entries from VTM Go.
 */
@Injectable()
export class VtmGoRetriever extends Retriever {
  protected readonly logger = new Logger(VtmGoRetriever.name);
  private cookie: string;

  constructor(protected readonly cacheService: EntriesLruCache) {
    super('https://vtm.be/vtmgo/zoeken', 'VTM GO', cacheService);

    this.cookie = `authId=${process.env.AUTH_VTMGO_AUTH_ID}`;
  }

  async retrieve(
    searchTerm: string,
    searchOptions: SearchOptions,
  ): Promise<Entry[]> {
    const reqUrl = new URL(this.baseSearchUrl);
    reqUrl.searchParams.append('query', searchTerm);
    const result = await fetch(reqUrl, {
      headers: { cookie: this.cookie },
    });

    if (!result.ok || result.status !== 200) {
      throw new Error(`Status (${result.status})`);
    }

    if (!result.headers.get('content-type')?.startsWith('text/html')) {
      throw new Error(`Content-Type: ${result.headers.get('content-type')}`);
    }

    const text = await result.text();

    if (text.includes('Beleef meer dankzij cookies!')) {
      throw new Error('Cookie consent required');
    }

    return vtmGoParser(
      text,
      this.platform,
      this.cookie,
      searchOptions,
      this.logger,
    );
  }
}
