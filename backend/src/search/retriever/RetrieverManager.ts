import { Injectable } from '@nestjs/common';
import { Entry } from '../../models/Entry';
import { Retriever } from './Retriever';
import { GoPlayRetriever } from './retrievers/GoPlayRetriever';
import { VtmGoRetriever } from './retrievers/VtmGoRetriever';

@Injectable()
export class RetrieverManager {
  private readonly retrievers: Retriever[];

  constructor(
    private readonly goPlayRetriever: GoPlayRetriever,
    private readonly vtmGoRetriever: VtmGoRetriever,
  ) {
    this.retrievers = [this.goPlayRetriever, this.vtmGoRetriever];
  }

  async retrieveAll(searchTerm: string): Promise<Entry[]> {
    const retrieveAll = this.retrievers.map((r) => r.search(searchTerm));
    const allAwaited = await Promise.all(retrieveAll);
    return allAwaited.reduce((acc, val) => acc.concat(val), []);
  }

}
