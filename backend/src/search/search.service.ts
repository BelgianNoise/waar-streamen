import { Injectable } from '@nestjs/common';
import { RetrieverManager } from './retriever/RetrieverManager';
import { Entry } from '../models/Entry';

@Injectable()
export class SearchService {
  constructor(private readonly retrieverManager: RetrieverManager) {}

  async search(searchTerm: string): Promise<Entry[]> {
    return this.retrieverManager.retrieveAll(searchTerm);
  }
}
