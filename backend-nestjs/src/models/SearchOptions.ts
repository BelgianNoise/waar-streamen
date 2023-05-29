// How resource intensive the data should be fetched.
// Some data requires multiple fetches to be correctly retrieved.
export const fetchDepths = ['shallow', 'deep', 'full'] as const;
export type FetchDepth = typeof fetchDepths[number];

export interface SearchOptions {
  fetchDepth: FetchDepth;
}
