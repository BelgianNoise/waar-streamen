import { Injectable, Logger } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import { vtmGoParser } from '../../../util/functions/VtmGoParser';
import { EntriesLruCache } from '../../cache/EntriesLruCache';
import { SearchOptions } from '../../../models/SearchOptions';

/**
 * Retrieves entries from Streamz.
 */
@Injectable()
export class StreamzRetriever extends Retriever {
  protected readonly logger = new Logger(StreamzRetriever.name);
  private cookie: string;

  constructor(protected readonly cacheService: EntriesLruCache) {
    super('https://www.streamz.be/streamz/zoeken', 'Streamz', cacheService);

    this.cookie =
      `lfvp_auth_token=${process.env.AUTH_STREAMZ_AUTH_TOKEN}; ` +
      `lfvp_id_token=${process.env.AUTH_STREAMZ_ID_TOKEN}; ` +
      `lfvp_access_token=${process.env.AUTH_STREAMZ_ACCESS_TOKEN}; ` +
      `lfvp_refresh_token=${process.env.AUTH_STREAMZ_REFRESH_TOKEN}; ` +
      `lfvp_auth.profile=${process.env.AUTH_STREAMZ_PROFILE}`;
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

    if (text.includes('Kies het abonnement en de looptijd die bij je past')) {
      throw new Error('Authentication failed');
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
