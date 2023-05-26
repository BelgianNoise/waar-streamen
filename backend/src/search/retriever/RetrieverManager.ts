import { Injectable } from '@nestjs/common';
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
    const retrieveAll = this.retrievers.map((r) =>
      r.search(searchTerm, searchOptions),
    );
    const allAwaited = await Promise.all(retrieveAll);
    return allAwaited.reduce((acc, val) => acc.concat(val), []);
  }
}
