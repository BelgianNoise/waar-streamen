import { Injectable } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import {
  vrtMaxDetailsQuery,
  vrtMaxListQuery,
  vrtMaxSearchQuery,
} from '../../variables/VrtMaxQueries';
import { EntriesLruCache } from '../../cache/EntriesLruCache';
import { SearchOptions } from '../../../models/SearchOptions';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * Retrieves entries from VRT MAX.
 */
@Injectable()
export class VrtMaxRetriever extends Retriever {
  constructor(
    @InjectPinoLogger(VrtMaxRetriever.name)
    protected readonly logger: PinoLogger,
    protected readonly cacheService: EntriesLruCache,
  ) {
    super(
      logger,
      'https://www.vrt.be/vrtnu-api/graphql/public/v1',
      'VRT MAX',
      cacheService,
    );
  }

  async retrieve(
    searchTerm: string,
    searchOptions: SearchOptions,
  ): Promise<Entry[]> {
    const result = await fetch(this.baseSearchUrl, {
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
        query: vrtMaxSearchQuery,
      }),
    });

    if (!result.ok || result.status !== 200) {
      throw new Error(`Status (${result.status})`);
    }

    if (!result.headers.get('content-type')?.startsWith('application/json')) {
      throw new Error(`Content-Type: ${result.headers.get('content-type')}`);
    }

    const json = (await result.json()) as unknown as VrtMaxSearchFetchResponse;
    const items = json.data.uiSearch[0].items;
    if (!items) return [];
    const item = items.find((item) => item.title.includes('Kijk'));
    if (!item) throw new Error('Response parsing failed (item)');
    const edges = item.components[0].paginatedItems.edges;
    const entries = edges.map((edge) => {
      const entry: Entry = {
        platform: this.platform,
        title: edge.node.title,
        description: edge.node.description,
        imageUrl: edge.node.image?.templateUrl,
        link: `https://www.vrt.be${edge.node.link}`,
        language: '-',
        seasons: new Map(),
      };

      return entry;
    });

    if (searchOptions.fetchDepth !== 'shallow') {
      const entriesWithEpisodes = entries.map((entry) =>
        this.retrieveEpisodes(entry, searchOptions),
      );
      return Promise.all(entriesWithEpisodes);
    } else {
      return entries;
    }
  }

  private async retrieveEpisodes(
    entry: Entry,
    searchOptions: SearchOptions,
  ): Promise<Entry> {
    try {
      const id = new URL(entry.link).pathname.replace(/\/$/, '');
      const result = await fetch(this.baseSearchUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-vrt-client-name': 'WEB',
        },
        body: JSON.stringify({
          operationName: 'VideoProgramPage',
          variables: {
            pageId: `${id}.model.json`,
          },
          query: vrtMaxDetailsQuery,
        }),
      });

      const json =
        (await result.json()) as unknown as VrtMaxDetailsFetchResponse;
      const items = json.data.page.components[1].items;
      if (!items) return entry;
      const aflItem = items.find((item) =>
        item.title.toLowerCase().includes('afleveringen'),
      );
      if (!aflItem) return entry;
      const seasonItems = aflItem.components[0].items;
      const paginated = aflItem.components[0].paginatedItems;
      if (seasonItems) {
        // This occurs when multiple seasons are available
        for (const seasonItem of seasonItems) {
          // Set season as key in map
          const title = seasonItem.title;
          const seasonString = title.match(/Seizoen (\d+)/)?.[1];
          if (!seasonString) continue;
          const seasonInt = parseInt(seasonString);
          entry.seasons.set(seasonInt, new Set());

          // Add all episode numbers
          if (searchOptions.fetchDepth === 'full') {
            const paginated = seasonItem.components[0].paginatedItems;
            const listId = seasonItem.components[0].listId;
            if (paginated) {
              // This contains all episodes already
              for (const edge of paginated.edges) {
                const parsedMeta = this.parsePrimaryMeta(edge.node.primaryMeta);
                if (!parsedMeta) continue;
                entry.seasons
                  .get(parseInt(parsedMeta.season))
                  ?.add(parseInt(parsedMeta.episode));
              }
            } else if (listId) {
              // These seasons require further requests to get the episodes
              const episodeNumbers = await this.retrieveExtraEpisodes(listId);
              for (const episodeNumber of episodeNumbers) {
                entry.seasons.get(seasonInt)?.add(episodeNumber);
              }
            }
          }
        }
      } else if (paginated) {
        // This occurs when only one season is available
        for (const edge of paginated.edges) {
          const parsedMeta = this.parsePrimaryMeta(edge.node.primaryMeta);
          if (!parsedMeta) continue;
          // set season as key in map if doesnt exist yet
          const has = entry.seasons.has(parseInt(parsedMeta.season));
          if (!has) entry.seasons.set(parseInt(parsedMeta.season), new Set());
          entry.seasons
            .get(parseInt(parsedMeta.season))
            ?.add(parseInt(parsedMeta.episode));
        }
      }

      return entry;
    } catch (e) {
      this.logger.warn({
        msg: `Error occured while retrieving episode data:`,
        error: e,
      });
      return entry;
    }
  }

  private async retrieveExtraEpisodes(listId: string): Promise<number[]> {
    const result: number[] = [];

    const response = await fetch(this.baseSearchUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-vrt-client-name': 'WEB',
      },
      body: JSON.stringify({
        operationName: 'ProgramSeasonEpisodeList',
        variables: {
          listId: listId,
        },
        query: vrtMaxListQuery,
      }),
    });

    const json = (await response.json()) as unknown as VrtMaxListFetchResponse;
    const items = json.data.list.items;
    for (const item of items) {
      if (!item.primaryMeta) continue;
      const parsedMeta = this.parsePrimaryMeta(item.primaryMeta);
      if (!parsedMeta) continue;
      result.push(parseInt(parsedMeta.episode));
    }
    return result;
  }

  private parsePrimaryMeta(
    primaryMeta: {
      value: string;
    }[],
  ): { season: string; episode: string } | undefined {
    const episodeText = primaryMeta.find((meta) =>
      meta.value.toLowerCase().includes('aflevering'),
    );
    if (!episodeText) return undefined;
    const seasonText = primaryMeta.find((meta) =>
      meta.value.toLowerCase().includes('seizoen'),
    );
    if (!seasonText) return undefined;
    const season = seasonText.value.match(/(\d+)/)?.[1];
    const episode = episodeText.value.match(/(\d+)/)?.[1];
    if (!season || !episode) return undefined;
    return { season, episode };
  }
}

interface VrtMaxSearchFetchResponse {
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
                  templateUrl: string;
                };
              };
            }[];
          };
        }[];
      }[];
    }[];
  };
}

interface VrtMaxDetailsFetchResponse {
  data: {
    page: {
      components: {
        items: {
          title: string;
          components: {
            paginatedItems: {
              edges: {
                node: {
                  title: string;
                  primaryMeta: {
                    value: string;
                  }[];
                };
              }[];
            };
            items: {
              title: string;
              components: {
                // ListId is always present but only usefull when
                // potentionally retrieveing the episodes in the future
                listId?: string;
                // PaginatedItems is only present for 1 season
                paginatedItems?: {
                  edges: {
                    node: {
                      title: string;
                      primaryMeta: {
                        value: string;
                      }[];
                    };
                  }[];
                };
              }[];
            }[];
          }[];
        }[];
      }[];
    };
  };
}

interface VrtMaxListFetchResponse {
  data: {
    list: {
      items: {
        primaryMeta: {
          value: string;
        }[];
      }[];
    };
  };
}
