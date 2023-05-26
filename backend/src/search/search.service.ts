import { Injectable } from '@nestjs/common';
import { RetrieverManager } from './retriever/RetrieverManager';
import { Entry } from '../models/Entry';
import { FetchDepth, fetchDepths } from '../models/SearchOptions';

@Injectable()
export class SearchService {
  constructor(private readonly retrieverManager: RetrieverManager) {}

  async search(
    searchTerm: string,
    fetchDepth: FetchDepth | undefined,
  ): Promise<Entry[]> {
    if (typeof fetchDepth !== 'string' || !fetchDepths.includes(fetchDepth)) {
      fetchDepth = 'shallow';
    }
    return this.retrieverManager.retrieveAll(searchTerm, {
      fetchDepth,
    });
  }
}
