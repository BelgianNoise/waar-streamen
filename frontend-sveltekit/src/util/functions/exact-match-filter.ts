import type { Entry } from "../models/entry";

export const exactMatchFilter = (
  searchTerm: string,
  entries: Entry[],
): Entry[] => {
  const transformedSearchTerm = searchTerm
    .trim()
    .toLowerCase()
    .replace(/[-_]/gim, ' ')
    .replace(/'/gim, '')
    .replace(/\s+/gim, ' ');
  const filtered = entries.filter((i) => i.title
    .trim()
    .toLowerCase()
    .replace(/[-_]/gim, ' ')
    .replace(/'/gim, '')
    .replace(/\s+/gim, ' ')
    .includes(transformedSearchTerm));
  return filtered;
};
