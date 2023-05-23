import { Injectable } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import { parseLanguage } from '../../../models/Language';
import { EntriesInMemoryExpiringCache } from '../../cache/EntriesInMemoryExpiringCache';
import parse from 'node-html-parser';

/**
 * Retrieves entries from Streamz.
 */
@Injectable()
export class StreamzRetriever extends Retriever {
  private cookie: string;

  constructor(protected readonly cacheService: EntriesInMemoryExpiringCache) {
    super('https://www.streamz.be/streamz/zoeken', 'Streamz', cacheService);

    this.cookie =
      `lfvp_auth_token=${process.env.AUTH_STREAMZ_AUTH_TOKEN}; ` +
      `lfvp_id_token=${process.env.AUTH_STREAMZ_ID_TOKEN}; ` +
      `lfvp_access_token=${process.env.AUTH_STREAMZ_ACCESS_TOKEN}; ` +
      `lfvp_refresh_token=${process.env.AUTH_STREAMZ_REFRESH_TOKEN}; ` +
      `lfvp_auth.profile=${process.env.AUTH_STREAMZ_PROFILE}`;
  }

  async retrieve(searchTerm: string): Promise<Entry[]> {
    const reqUrl = new URL(this.baseSearchUrl);
    reqUrl.searchParams.append('query', searchTerm);
    const result = await fetch(reqUrl, {
      headers: { cookie: this.cookie },
    });
    console.log(this.cookie);
    if (!result.ok || result.status !== 200) {
      throw new Error(`Status (${result.status})`);
    }

    if (!result.headers.get('content-type')?.startsWith('text/html')) {
      throw new Error(`Content-Type: ${result.headers.get('content-type')}`);
    }

    const text = await result.text();

    if (text.includes('Kies het abonnement en de looptijd die bij je past')) {
      throw new Error('Authentication failed');
    }

    const parsed = parse(text);
    const items = parsed.querySelectorAll(
      'ol[data-title="Zoekresultaten"] .search__item',
    );
    const entries = items.map(async (item): Promise<Entry> => {
      const a: HTMLElement = item.querySelector('a') as unknown as HTMLElement;
      const link = a.getAttribute('href');
      const title = a.getAttribute('data-title');
      const img = a.querySelector('img.teaser__img');
      const imageUrl = img?.getAttribute('src') ?? '';

      const entry: Entry = {
        platform: this.platform,
        title: title ?? '',
        description: '',
        imageUrl: imageUrl,
        link: link ?? '',
        language: '-',
        seasons: new Map(),
      };

      if (link) {
        const detailed = await fetch(link, {
          headers: { cookie: this.cookie },
        });
        const detailedText = await detailed.text();
        const parsedDetail = parse(detailedText);
        // try get a better img in poster format
        const posterImg = parsedDetail.querySelector('.detail__poster');
        const posterImgUrl = posterImg?.getAttribute('src');
        if (posterImgUrl) entry.imageUrl = posterImgUrl;
        // try get a language from the page
        const detailMetaLabels = parsedDetail.querySelectorAll(
          '.detail__meta .detail__meta-label',
        );
        for (const label of detailMetaLabels) {
          const lang = parseLanguage(label.innerText);
          if (lang !== '-') {
            entry.language = lang;
            break;
          }
        }
        // try get a description from the page
        const detailDesc = parsedDetail.querySelector('.detail__description');
        if (detailDesc) entry.description = detailDesc.innerText;
        // try get seasons and episodes from the page
        // Retrieveing episodes is way too resource intensive because VTM GO
        // renders mostle server side.
        const seasons = parsedDetail.querySelectorAll(
          '#season-picker-wrapper .custom-select__option',
        );
        if (seasons.length > 0) {
          seasons.forEach((season) => {
            const innerText = season.innerText;
            const seasonMatch = innerText.match(/Seizoen ([0-9]+)/i);
            if (seasonMatch) {
              const seasonInt = parseInt(seasonMatch[1]);
              entry.seasons.set(seasonInt, new Set());
            }
          });
        } else {
          const matches = parsed.innerHTML.match(/seizoen\w?[0-9]+/gim);
          if (matches) {
            matches.forEach((match) => {
              const seasonMatch = match.match(/seizoen\w?([0-9]+)/i);
              if (seasonMatch) {
                const seasonInt = parseInt(seasonMatch[1]);
                entry.seasons.set(seasonInt, new Set());
              }
            });
          }
        }
      }

      return entry;
    });

    return Promise.all(entries);
  }
}
