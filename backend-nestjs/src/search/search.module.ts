import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { RetrieverManager } from './retriever/RetrieverManager';
import { EntriesLruCache } from './cache/EntriesLruCache';
import { GoPlayRetriever } from './retriever/retrievers/GoPlayRetriever';
import { VtmGoRetriever } from './retriever/retrievers/VtmGoRetriever';
import { StreamzRetriever } from './retriever/retrievers/StreamzRetriever';
import { VrtMaxRetriever } from './retriever/retrievers/VrtMaxRetriever';
import { RapidApiRetriever } from './retriever/retrievers/NetflixRetriever';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    EntriesLruCache,
    RetrieverManager,
    GoPlayRetriever,
    VtmGoRetriever,
    StreamzRetriever,
    VrtMaxRetriever,
    RapidApiRetriever,
  ],
})
export class SearchModule {}
