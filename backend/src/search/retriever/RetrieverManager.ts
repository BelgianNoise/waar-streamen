import { Injectable, Logger } from '@nestjs/common';
import { Entry } from '../../models/Entry';
import { Retriever } from './Retriever';
import { GoPlayRetriever } from './retrievers/GoPlayRetriever';
import { VtmGoRetriever } from './retrievers/VtmGoRetriever';
import { StreamzRetriever } from './retrievers/StreamzRetriever';
import { VrtMaxRetriever } from './retrievers/VrtMaxRetriever';
import { SearchOptions } from '../../models/SearchOptions';

/**
 * Class that is responsible for retrieving entries from all platforms.
 */
@Injectable()
export class RetrieverManager {
  private readonly logger = new Logger(RetrieverManager.name);
  private readonly retrievers: Retriever[];

  constructor(
    private readonly goPlayRetriever: GoPlayRetriever,
    private readonly vtmGoRetriever: VtmGoRetriever,
    private readonly streamzRetriever: StreamzRetriever,
    private readonly vrtMaxRetriever: VrtMaxRetriever,
  ) {
    this.retrievers = [
      this.goPlayRetriever,
      this.vtmGoRetriever,
      this.streamzRetriever,
      this.vrtMaxRetriever,
    ];
  }

  async retrieveAll(
    searchTerm: string,
    searchOptions: SearchOptions,
  ): Promise<Entry[]> {
    this.logger.debug(
      `Searching for "${searchTerm}" with options:`,
      searchOptions,
    );
    const retrieveAll = this.retrievers.map(async (r): Promise<Entry[]> => {
      const res = await r.search(searchTerm, searchOptions);
      this.logger.debug(`Retrieved ${res.length} entries from ${r.platform}`);
      return res;
    });
    const allAwaited = await Promise.all(retrieveAll);
    return allAwaited.reduce((acc, val) => acc.concat(val), []);
  }
}
