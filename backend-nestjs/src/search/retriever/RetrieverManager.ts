import { Injectable } from '@nestjs/common';
import { Entry } from '../../models/Entry';
import { Retriever } from './Retriever';
import { GoPlayRetriever } from './retrievers/GoPlayRetriever';
import { VtmGoRetriever } from './retrievers/VtmGoRetriever';
import { StreamzRetriever } from './retrievers/StreamzRetriever';
import { VrtMaxRetriever } from './retrievers/VrtMaxRetriever';
import { SearchOptions } from '../../models/SearchOptions';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * Class that is responsible for retrieving entries from all platforms.
 */
@Injectable()
export class RetrieverManager {
  private readonly retrievers: Retriever[];

  constructor(
    @InjectPinoLogger(RetrieverManager.name)
    private readonly logger: PinoLogger,
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
    this.logger.debug({
      msg: `Searching for "${searchTerm}" with options:`,
      options: searchOptions,
    });
    const retrieveAll = this.retrievers.map(async (r): Promise<Entry[]> => {
      const res = await r.search(searchTerm, searchOptions);
      this.logger.debug(`Retrieved ${res.length} entries from ${r.platform}`);
      return res;
    });
    const allAwaited = await Promise.all(retrieveAll);
    return allAwaited.reduce((acc, val) => acc.concat(val), []);
  }
}
