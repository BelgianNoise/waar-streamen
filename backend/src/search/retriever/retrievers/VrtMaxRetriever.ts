import { Injectable } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import { parseLanguage } from '../../../models/Language';
import { EntriesInMemoryExpiringCache } from '../../cache/EntriesInMemoryExpiringCache';
import { vrtMaxQuery } from '../../variables/VrtMaxQuery';

/**
 * Retrieves entries from VRT MAX.
 */
@Injectable()
export class VrtMaxRetriever extends Retriever {
  constructor(protected readonly cacheService: EntriesInMemoryExpiringCache) {
    super('https://www.vrt.be/vrtnu-api/graphql/v1', 'VRT MAX', cacheService);
  }

  async retrieve(searchTerm: string): Promise<Entry[]> {
    const result = await fetch(
      'https://www.vrt.be/vrtnu-api/graphql/public/v1',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-vrt-client-name': 'WEB',
        },
        body: JSON.stringify({
          operationName: 'Search',
          variables: {
            q: searchTerm,
            mediaType: 'all',
            facets: null,
          },
          query: vrtMaxQuery,
        }),
      },
    );

    if (!result.ok || result.status !== 200) {
      throw new Error(`Status (${result.status})`);
    }

    if (!result.headers.get('content-type')?.startsWith('application/json')) {
      throw new Error(`Content-Type: ${result.headers.get('content-type')}`);
    }

    const json = (await result.json()) as unknown as VrtMaxFetchResponse;
    const items = json.data.uiSearch[0].items;
    const item = items.find((item) => item.title.includes('Kijk'));
    if (!item) throw new Error('Response parsing failed');
    const edges = item.components[0].paginatedItems.edges;
    const entries = edges.map((edge) => {
      const entry: Entry = {
        platform: this.platform,
        title: edge.node.title,
        description: edge.node.description,
        imageUrl: edge.node.image.templateUri,
        link: edge.node.link, // link is not yet the correct value (/vrtnu/a-z/<name>/)
        language: '-',
        seasons: new Map(),
      };

      return entry;
    });

    return entries;
  }
}

interface VrtMaxFetchResponse {
  data: {
    uiSearch: {
      items: {
        title: string;
        components: {
          paginatedItems: {
            edges: {
              node: {
                description: string;
                id: string;
                link: string;
                title: string;
                image: {
                  templateUri: string;
                };
              };
            }[];
          };
        }[];
      }[];
    }[];
  };
}
