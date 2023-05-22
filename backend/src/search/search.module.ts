import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { RetrieverManager } from './retriever/RetrieverManager';
import { GoPlayRetriever } from './retriever/retrievers/GoPlayRetriever';
import { VtmGoRetriever } from './retriever/retrievers/VtmGoRetriever';
import { EntriesInMemoryExpiringCache } from './cache/EntriesInMemoryExpiringCache';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    EntriesInMemoryExpiringCache,
    RetrieverManager,
    GoPlayRetriever,
    VtmGoRetriever,
  ],
})
export class SearchModule {}
