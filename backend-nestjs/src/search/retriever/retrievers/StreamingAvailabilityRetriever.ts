import { Injectable } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Platform } from '../../../models/Platform';
import { Retriever } from '../Retriever';
import { EntriesLruCache } from '../../cache/EntriesLruCache';
import { SearchOptions } from '../../../models/SearchOptions';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * This all is in one Retriever because RapidAPI uses the same request for all
 * streaming services. Also limited to 100 requests per day, so let's use all
 * data we receive.
 * - Netflix
 * - Prime
 * - Apple
 * - Disney
 * - Zee5
 * - Mubi
 *
 * Netflix does not allow searching via an API and their website is very hard
 * to scrape. So we use RapidAPI to search for Netflix content.
 * Other platforms were a bonus
 */
@Injectable()
export class StreamingAvailabilityRetriever extends Retriever {
  private rapidAPIKey: string;

  constructor(
    @InjectPinoLogger(StreamingAvailabilityRetriever.name)
    protected readonly logger: PinoLogger,
    protected readonly cacheService: EntriesLruCache,
  ) {
    super(
      logger,
      'https://streaming-availability.p.rapidapi.com/v2/search/title',
      'RapidAPI',
      cacheService,
    );

    this.rapidAPIKey = `${process.env.AUTH_RAPID_API_KEY}`;
  }

  async retrieve(
    searchTerm: string,
    searchOptions: SearchOptions,
  ): Promise<Entry[]> {
    const url = new URL(this.baseSearchUrl);
    url.searchParams.append('title', searchTerm);
    url.searchParams.append('country', 'be');
    url.searchParams.append('show_type', 'all');
    url.searchParams.append('output_language', 'en');

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': this.rapidAPIKey,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
      },
    });
    const json = await response.json();

    if (json.message) {
      throw new Error(json.message);
    }

    const filtered = json.result.filter((e: any) => e.streamingInfo?.be);

    const result: Entry[] = filtered.reduce((acc: Entry[], curr: any) => {
      const platforms = Object.keys(curr.streamingInfo.be);
      const perPlatform = platforms.map((p: string) => {
        const e: Entry = {
          platform: (p.charAt(0).toUpperCase() +
            p.slice(1)) as unknown as Platform,
          title: curr.title,
          description: curr.overview,
          imageUrl: curr.posterURLs.original,
          language: curr.originalLanguage,
          link: curr.streamingInfo.be[p][0].link,
          seasons: new Map(),
        };

        try {
          for (const season of curr.seasons ?? []) {
            const title: string = season.title;
            if (title) {
              const titleMatch = title.match(/\d+/g);
              let seasonNumber;
              if (titleMatch?.length) {
                seasonNumber = parseInt(titleMatch[0]);
              } else {
                seasonNumber = 1;
              }
              e.seasons.set(seasonNumber, new Set());
              if (season.episodes && Array.isArray(season.episodes)) {
                for (let i = 1; i <= season.episodes.length; i++) {
                  e.seasons.get(seasonNumber)?.add(i);
                }
              }
            }
          }
        } catch (e) {
          this.logger.error(e);
        } finally {
          return e;
        }
      });

      return [...acc, ...perPlatform];
    }, []);

    return result;
  }
}
