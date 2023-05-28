import { parseLanguage } from '../../models/Language';
import { Entry } from '../../models/Entry';
import parse from 'node-html-parser';
import { Platform } from '../../models/Platform';
import { SearchOptions } from '../../models/SearchOptions';
import * as nodeHtmlParser from 'node-html-parser';
import { Logger } from '@nestjs/common';

// This code was originally part of VtmGoRetriever.ts, but StreamzRetriever.ts
// uses exactly the same code. So I moved it to a separate file.
export const vtmGoParser = async (
  text: string,
  platform: Platform,
  authCookie: string,
  searchOptions: SearchOptions,
  logger: Logger,
): Promise<Entry[]> => {
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
      platform: platform,
      title: title ?? '',
      description: '',
      imageUrl: imageUrl,
      link: link ?? '',
      language: '-',
      seasons: new Map(),
    };

    if (link && searchOptions.fetchDepth !== 'shallow') {
      const detailed = await fetch(link, {
        headers: { cookie: authCookie },
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
      const seasons = parsedDetail.querySelectorAll(
        '#season-picker-wrapper .custom-select__option',
      );
      if (seasons.length > 0) {
        // There are multiple seasons and there is a dropdown to select them.
        // Set all season numbers
        const seasonNumbers = seasons.reduce((acc, curr) => {
          const seasonMatch = curr.innerText.match(/Seizoen ([0-9]+)/i);
          if (seasonMatch) {
            const seasonInt = parseInt(seasonMatch[1]);
            return [...acc, seasonInt];
          } else {
            return acc;
          }
        }, []);
        for (const seasonNumber of seasonNumbers) {
          entry.seasons.set(seasonNumber, new Set());
        }
        if (searchOptions.fetchDepth === 'full') {
          // Try fetch episodes for every season
          const episodePromises = seasonNumbers.map(
            async (seasonNumber): Promise<void> => {
              try {
                const episodeFetch = await fetch(
                  `${entry.link}/seizoen-${seasonNumber}`,
                  {
                    headers: { cookie: authCookie },
                  },
                );
                const episodeText = await episodeFetch.text();
                const parsedEpisodes = parse(episodeText);
                parseEpisodes(parsedEpisodes, entry, seasonNumber);
              } catch (e) {
                logger.log(`Error fetching episodes for ${entry.link}`, e);
                return;
              }
            },
          );

          // run all promises in parallel
          await Promise.all(episodePromises);
        }
      } else {
        // There is only one season and the episodes are listed on the page.
        // The season number is not always explicitly available
        parseSingleSeasonPage(parsedDetail, entry);
      }
    }

    return entry;
  });

  return Promise.all(entries);
};

const parseSingleSeasonPage = (
  parsedPage: nodeHtmlParser.HTMLElement,
  entry: Entry,
): void => {
  const matches = parsedPage.innerHTML.match(/seizoen\w?([0-9]+)/gim);
  let seasonNumber: number;
  if (matches) {
    // season was listed on the page
    seasonNumber = parseInt(matches[1]);
    entry.seasons.set(seasonNumber, new Set());
  } else {
    // default to season 1
    seasonNumber = 1;
    entry.seasons.set(seasonNumber, new Set());
  }
  // Parse all episodes
  parseEpisodes(parsedPage, entry, seasonNumber);
};

const parseEpisodes = (
  parsedPage: nodeHtmlParser.HTMLElement,
  entry: Entry,
  seasonNumber: number,
): void => {
  const episodes = parsedPage.querySelectorAll(
    '.detail__season .media__body .media__link span',
  );
  episodes.forEach((episode) => {
    const episodeName = episode.innerText.match(/[0-9]+/);
    if (episodeName) {
      entry.seasons.get(seasonNumber)?.add(parseInt(episodeName[0]));
    }
  });
};
