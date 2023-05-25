import { Injectable } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import { parseLanguage } from '../../../models/Language';
import parse from 'node-html-parser';
import { EntriesLruCache } from '../../cache/EntriesLruCache';

/**
 * Retrieves entries from GoPlay.
 */
@Injectable()
export class GoPlayRetriever extends Retriever {
  constructor(protected readonly cacheService: EntriesLruCache) {
    super('https://api.goplay.be/search', 'GoPlay', cacheService);
  }

  async retrieve(searchTerm: string): Promise<Entry[]> {
    const result = await fetch(this.baseSearchUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: searchTerm,
        page: 0,
        mode: 'programs',
      }),
    });

    if (!result.ok || result.status !== 200) {
      throw new Error(`Status (${result.status})`);
    }

    if (result.headers.get('content-type') !== 'application/json') {
      throw new Error(`Content-Type: ${result.headers.get('content-type')}`);
    }

    const json = (await result.json()) as GoPlayFetchResponse;
    const parsedList = json.hits.hits.map(async (hit): Promise<Entry> => {
      const entry: Entry = {
        platform: this.platform,
        title: hit._source.title,
        description: hit._source.intro,
        imageUrl: hit._source.img,
        link: hit._source.url,
        language: parseLanguage(hit._source.language),
        seasons: new Map(),
      };

      const detailsResponse = await fetch(entry.link);
      const text = await detailsResponse.text();
      const parsedDOM = parse(text);
      const dataHero = parsedDOM.querySelector('main div:nth-child(2)');
      const seasonMatches = dataHero?.rawAttrs.match(
        /s[0-9]+-aflevering-[0-9]+/gim,
      );
      if (seasonMatches) {
        seasonMatches.sort().forEach((match) => {
          const season = match.match(/^s([0-9]+)/i);
          const episode = match.match(/([0-9]+)$/i);
          if (season && episode) {
            const seasonInt = parseInt(season[1]);
            const episodeInt = parseInt(episode[1]);
            const hasSeason = entry.seasons.has(seasonInt);
            if (hasSeason) {
              entry.seasons.get(seasonInt)?.add(episodeInt);
            } else {
              entry.seasons.set(seasonInt, new Set([episodeInt]));
            }
          }
        });
      }

      return entry;
    });

    return Promise.all(parsedList);
  }
}

interface GoPlayFetchResponse {
  hits: {
    total: number;
    hits: {
      highlight: {
        intro: string[];
      };
      _source: {
        body: string[];
        bundle: string;
        changed: string;
        created: string;
        docType: string;
        id: string;
        img: string;
        intro: string;
        language: string;
        program: string;
        suggest: string;
        terms: string[];
        title: string;
        tracking: {
          item_brand: string;
          item_category: string;
          item_id: string;
          item_name: string;
        };
        type: string;
        url: string;
      };
    }[];
  };
  timed_out: boolean;
  took: number;
}
