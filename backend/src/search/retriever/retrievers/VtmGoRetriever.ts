import { Injectable } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import { parseLanguage } from '../../../models/Language';
import { EntriesInMemoryExpiringCache } from '../../cache/EntriesInMemoryExpiringCache';
import parse from 'node-html-parser';

/**
 * Retrieves entries from VTM Go.
 */
@Injectable()
export class VtmGoRetriever extends Retriever {
  private cookie =
    'ak_bmsc=5B4BF33808FE4F21B45D8D46F3E88EB3~000000000000000000000000000000~YAAQfMQRAgOs+wKIAQAAuD7uRBMVY+u7bXEvkbv71hrtZ0hH6aIIxSPeGKy1lOCDq3LxMT3tqQPGsRd4xlAsxF2NcRa5zPWmRht/S0Jx8VAWHXSh5t4QFwK8wgQ5LTfJrzrYkSHi5dWFpCHuLIWOs2n3xmWtOFN9hC5/dPkTv5MHV5WPoeV6HomZTvR+pCjGqbBD3RCOYkUP0LtwtADo2SNlgFFGqaWNYMSZV+2+CdXIc2WLVyo/N+k5C559+OoL2+nKEOG6uaB34CqsLmAbe6+WN+T68+x0SLp3gjepCYaj1TC8HIJURNbFp68isXNHDICkFWeOh2LO82C5GczhfYi/tnSzvaaMSq9EHnRHGoCT4qB/vxZbJCY3hjUL0Nz5NPs+Tow=; authId=8559bdab-a5b7-4ca5-8002-9e517888d146; bm_sv=63C3A3F8D82A676A4D1DFBDF84EA41E7~YAAQfMQRAqSx+wKIAQAAAETvRBP+QRJSSiRYgj1XY3LtPrTwdOE7M0DiRoDJ+QX3in88GGd9Esdg6NavvhW4W/liuOfvtOeiSq2UK/QhKco6At9PfoqJ/nfh87m3GW2YrG0ckMi7oiGhd9LqYkGQ2EjGRvDY6DDcDvgyOLd4QEhSWw+nPXHgVr10qy++gvz/0p4kQRzSfyhHWxRM67d1/5jIVEKjT04zToMsczbEl391Abtyev3dB+zjX0o=~1';

  constructor(protected readonly cacheService: EntriesInMemoryExpiringCache) {
    super('https://vtm.be/vtmgo/zoeken', 'VTM GO', cacheService);
  }

  async retrieve(searchTerm: string): Promise<Entry[]> {
    const reqUrl = new URL(this.baseSearchUrl);
    reqUrl.searchParams.append('query', searchTerm);
    const result = await fetch(reqUrl, {
      headers: { cookie: this.cookie },
    });

    if (!result.ok || result.status !== 200) {
      throw new Error(`Status (${result.status})`);
    }

    if (!result.headers.get('content-type')?.startsWith('text/html')) {
      throw new Error(`Content-Type: ${result.headers.get('content-type')}`);
    }

    const text = await result.text();

    if (text.includes('Beleef meer dankzij cookies!')) {
      throw new Error('Cookie consent required');
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
